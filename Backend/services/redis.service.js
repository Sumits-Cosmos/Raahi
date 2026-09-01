const Redis = require('ioredis');

// Connect to Redis with retry and fallback handling
const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`;

let isRedisConnected = false;

const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > 3) {
      return null; // Stop retrying if Redis is not running locally in dev
    }
    return Math.min(times * 200, 1000);
  },
  lazyConnect: true // Don't throw unhandled error on initial startup
});

// Attempt initial connection
redisClient.connect()
  .then(() => {
    isRedisConnected = true;
    console.log('⚡ [Redis Service] Connected successfully to Redis at:', redisUrl);
  })
  .catch((err) => {
    isRedisConnected = false;
    console.warn('⚠️ [Redis Service] Redis server not reachable. Running in standalone fallback mode:', err.message);
  });

redisClient.on('connect', () => {
  isRedisConnected = true;
  console.log('⚡ [Redis Service] Redis connection established');
});

redisClient.on('error', (err) => {
  if (isRedisConnected) {
    console.error('❌ [Redis Error]:', err.message);
  }
  isRedisConnected = false;
});

const CAPTAINS_GEO_KEY = 'captains:available';
const CAPTAIN_INFO_PREFIX = 'captain:info:';
const RIDE_LOCK_PREFIX = 'lock:ride:';

/**
 * Update Captain's live GPS coordinates in Redis GEO
 * @param {string} captainId 
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {object} metadata - vehicle info, socketId, name
 */
async function setCaptainLocation(captainId, latitude, longitude, metadata = {}) {
  if (!isRedisConnected || !captainId || !latitude || !longitude) return false;

  try {
    const pipeline = redisClient.pipeline();

    // 1. Ingest coordinate into Redis GEO (Longitude first, Latitude second)
    pipeline.geoadd(CAPTAINS_GEO_KEY, longitude, latitude, captainId.toString());

    // 2. Set ephemeral captain metadata with 15s TTL (heartbeat timeout)
    const infoKey = `${CAPTAIN_INFO_PREFIX}${captainId}`;
    const data = JSON.stringify({
      captainId: captainId.toString(),
      latitude,
      longitude,
      vehicleType: metadata.vehicleType || 'car',
      socketId: metadata.socketId || '',
      updatedAt: Date.now()
    });
    pipeline.set(infoKey, data, 'EX', 15);

    await pipeline.exec();
    return true;
  } catch (err) {
    console.warn('⚠️ [Redis setCaptainLocation error]:', err.message);
    return false;
  }
}

/**
 * Remove captain from available GEO pool when offline or on a trip
 * @param {string} captainId 
 */
async function removeCaptainLocation(captainId) {
  if (!isRedisConnected || !captainId) return false;

  try {
    const pipeline = redisClient.pipeline();
    pipeline.zrem(CAPTAINS_GEO_KEY, captainId.toString());
    pipeline.del(`${CAPTAIN_INFO_PREFIX}${captainId}`);
    await pipeline.exec();
    return true;
  } catch (err) {
    console.warn('⚠️ [Redis removeCaptainLocation error]:', err.message);
    return false;
  }
}

/**
 * High-speed Proximity Search using Redis GEOSEARCH
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {number} radiusKm 
 * @param {number} count 
 * @returns {Promise<Array>} Array of { captainId, distanceKm, coordinates, info }
 */
async function getCaptainsInRadius(latitude, longitude, radiusKm = 3, count = 10) {
  if (!isRedisConnected) return null; // Returns null to signal fallback to MongoDB

  try {
    // Redis 6.2+ GEOSEARCH command
    const results = await redisClient.geosearch(
      CAPTAINS_GEO_KEY,
      'FROMLONLAT',
      longitude,
      latitude,
      'BYRADIUS',
      radiusKm,
      'km',
      'WITHDIST',
      'WITHCOORD',
      'ASC',
      'COUNT',
      count
    );

    if (!Array.isArray(results) || results.length === 0) {
      return [];
    }

    // Format results and fetch live metadata
    const captains = await Promise.all(
      results.map(async ([captainId, distance, coords]) => {
        let meta = {};
        try {
          const rawInfo = await redisClient.get(`${CAPTAIN_INFO_PREFIX}${captainId}`);
          if (rawInfo) meta = JSON.parse(rawInfo);
        } catch (_) {}

        return {
          captainId,
          distanceKm: parseFloat(distance),
          longitude: parseFloat(coords[0]),
          latitude: parseFloat(coords[1]),
          ...meta
        };
      })
    );

    return captains;
  } catch (err) {
    console.warn('⚠️ [Redis getCaptainsInRadius fallback]:', err.message);
    return null; // Fallback to MongoDB
  }
}

/**
 * Atomic Distributed Lock to prevent duplicate ride acceptances
 * @param {string} rideId 
 * @param {string} captainId 
 * @param {number} ttlMs - lock duration in ms (default 5000ms)
 * @returns {Promise<boolean>} true if lock acquired, false if already taken
 */
async function acquireRideLock(rideId, captainId, ttlMs = 5000) {
  if (!isRedisConnected) return true; // Standalone fallback

  try {
    const lockKey = `${RIDE_LOCK_PREFIX}${rideId}`;
    const result = await redisClient.set(lockKey, captainId.toString(), 'NX', 'PX', ttlMs);
    return result === 'OK';
  } catch (err) {
    console.warn('⚠️ [Redis acquireRideLock error]:', err.message);
    return true; // Fallback allow
  }
}

/**
 * Release atomic distributed lock
 * @param {string} rideId 
 * @param {string} captainId 
 */
async function releaseRideLock(rideId, captainId) {
  if (!isRedisConnected) return true;

  try {
    const lockKey = `${RIDE_LOCK_PREFIX}${rideId}`;
    // Lua script to safely release only if the lock still belongs to this captain
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await redisClient.eval(luaScript, 1, lockKey, captainId.toString());
    return true;
  } catch (err) {
    console.warn('⚠️ [Redis releaseRideLock error]:', err.message);
    return false;
  }
}

/**
 * Get total live available captains count in RAM
 */
async function getLiveCaptainsCount() {
  if (!isRedisConnected) return 0;
  try {
    return await redisClient.zcard(CAPTAINS_GEO_KEY);
  } catch (_) {
    return 0;
  }
}

module.exports = {
  redisClient,
  isRedisConnected: () => isRedisConnected,
  setCaptainLocation,
  removeCaptainLocation,
  getCaptainsInRadius,
  acquireRideLock,
  releaseRideLock,
  getLiveCaptainsCount
};
