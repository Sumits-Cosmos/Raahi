const rideModel = require('../models/ride.model');
const mapService = require('../services/map.service');
const crypto = require('crypto')

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error('Pickup and Destination are required');
  }

  // Fetch route and distance data
  const routeData = await mapService.getRoute(pickup, destination);
  const distanceKm = routeData.primaryRoute?.distanceKm || parseFloat(routeData.distance) || 3.0;
  const durationMin = routeData.primaryRoute?.durationMin || parseFloat(routeData.duration) || 10.0;

  // 1. Base Rates & Multipliers
  const baseFare = { auto: 30, car: 50, bike: 20 };
  const perKmRate = { auto: 10, car: 15, bike: 8 };
  const perMinuteRate = { auto: 2, car: 3, bike: 1.5 };

  // 2. Real-time Demand & Supply Surge Calculation
  let surgeMultiplier = 1.0;
  let surgeReason = 'Standard pricing';
  let nightSurcharge = 0;

  try {
    const pickupCoords = routeData.pickupCoords;
    if (pickupCoords && pickupCoords.latitude && pickupCoords.longitude) {
      // Find nearby available captains in 3km
      const nearbyCaptains = await mapService.getCaptainsInRadius(pickupCoords.latitude, pickupCoords.longitude, 3);
      const captainCount = Math.max(nearbyCaptains.length, 1);

      // Check recent ride creation activity in last 15 minutes
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const recentRidesCount = await rideModel.countDocuments({
        createdAt: { $gte: fifteenMinutesAgo }
      });

      const demandRatio = (recentRidesCount + 1) / captainCount;

      if (demandRatio > 1.2) {
        surgeMultiplier += Math.min(0.6, (demandRatio - 1) * 0.25);
        surgeReason = 'High demand in your area';
      }
    }
  } catch (err) {
    console.warn('Surge calculation fallback to time-based factors:', err.message);
  }

  // 3. Peak Hours & Late-Night Surcharge Factors
  const now = new Date();
  const currentHour = now.getHours(); // 0 - 23

  // Peak Rush Hours: 8:00 AM - 10:30 AM or 5:30 PM - 9:00 PM
  const isMorningPeak = currentHour >= 8 && currentHour <= 10;
  const isEveningPeak = currentHour >= 17 && currentHour <= 21;
  const isLateNight = currentHour >= 23 || currentHour < 5;

  if (isMorningPeak || isEveningPeak) {
    surgeMultiplier += 0.15;
    surgeReason = isMorningPeak ? 'Morning Rush Hour' : 'Evening Peak Traffic';
  } else if (isLateNight) {
    surgeMultiplier += 0.20;
    nightSurcharge = 25; // Flat ₹25 late-night driver incentive
    surgeReason = 'Late Night Surcharge';
  }

  // Clamp surge multiplier between 1.0x and 2.5x
  surgeMultiplier = Math.min(2.5, Math.max(1.0, parseFloat(surgeMultiplier.toFixed(2))));

  // 4. Calculate Final Fares
  const autoRaw = (baseFare.auto + (distanceKm * perKmRate.auto) + (durationMin * perMinuteRate.auto)) * surgeMultiplier + nightSurcharge;
  const carRaw = (baseFare.car + (distanceKm * perKmRate.car) + (durationMin * perMinuteRate.car)) * surgeMultiplier + nightSurcharge;
  const bikeRaw = (baseFare.bike + (distanceKm * perKmRate.bike) + (durationMin * perMinuteRate.bike)) * surgeMultiplier + nightSurcharge;

  const fare = {
    auto: Math.round(autoRaw),
    car: Math.round(carRaw),
    bike: Math.round(bikeRaw),
    breakdown: {
      distance: `${distanceKm.toFixed(2)} km`,
      duration: `${durationMin} mins`,
      distanceKm,
      durationMin,
      surgeMultiplier,
      isSurgeActive: surgeMultiplier > 1.05,
      surgeReason,
      nightSurcharge,
      rates: {
        auto: {
          baseFare: baseFare.auto,
          distanceFare: Math.round(distanceKm * perKmRate.auto),
          timeFare: Math.round(durationMin * perMinuteRate.auto),
          total: Math.round(autoRaw)
        },
        car: {
          baseFare: baseFare.car,
          distanceFare: Math.round(distanceKm * perKmRate.car),
          timeFare: Math.round(durationMin * perMinuteRate.car),
          total: Math.round(carRaw)
        },
        bike: {
          baseFare: baseFare.bike,
          distanceFare: Math.round(distanceKm * perKmRate.bike),
          timeFare: Math.round(durationMin * perMinuteRate.bike),
          total: Math.round(bikeRaw)
        }
      }
    }
  };

  return fare;
}

module.exports.getFare = getFare;

function getOtp(num){
  function generateOtp(num){
    const otp = crypto.randomInt(Math.pow(10, num-1), Math.pow(10, num)).toString();
    return otp;
  }
  return generateOtp(num);
}


module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {

    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType]
    })

    return ride;

}

