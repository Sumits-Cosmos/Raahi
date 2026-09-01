const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const redisService = require('./services/redis.service');
const { createAdapter } = require('@socket.io/redis-adapter');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    // Attach Redis adapter if Redis is connected (enables multi-server horizontal scaling)
    try {
        if (redisService.isRedisConnected()) {
            const pubClient = redisService.redisClient;
            const subClient = pubClient.duplicate();
            io.adapter(createAdapter(pubClient, subClient));
            console.log('⚡ [Socket.IO] Redis Pub/Sub Adapter attached successfully');
        }
    } catch (err) {
        console.warn('⚠️ [Socket.IO Adapter warning]:', err.message);
    }

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            
            console.log(`🔌 [JOIN EVENT] UserType: ${userType}, UserId: ${userId}, SocketId: ${socket.id}`);
            socket.userId = userId;
            socket.userType = userType;

            try {
                if (userType === 'user') {
                    const user = await userModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
                    console.log(`✅ [JOIN] User socketId updated: ${user?.socketId}`);
                } else if (userType === 'captain') {
                    const captain = await captainModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
                    console.log(`✅ [JOIN] Captain socketId updated: ${captain?.socketId}`);
                    
                    // If captain has known location, register in Redis GEO
                    if (captain?.location?.coordinates) {
                        await redisService.setCaptainLocation(
                            userId,
                            captain.location.coordinates[1],
                            captain.location.coordinates[0],
                            {
                                vehicleType: captain.vehicle?.vehicleType || 'car',
                                socketId: socket.id
                            }
                        );
                    }
                }
            } catch (err) {
                console.error(`❌ [JOIN ERROR]:`, err.message);
            }
        });

        // Join ride room
        socket.on('join-ride-room', (data) => {
            const { rideId } = data;
            if (rideId) {
                socket.join(`ride_${rideId}`);
                console.log(`🔌 Socket ${socket.id} joined room: ride_${rideId}`);
            }
        });

        // Captain sends live location update
        socket.on('update-location-captain', async (data) => {
            const { userId, location, rideId, userSocketId } = data;

            if (!location || !location.latitude || !location.longitude) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                // 1. High-speed Redis GEO Ingestion (< 1ms)
                redisService.setCaptainLocation(
                    userId,
                    location.latitude,
                    location.longitude,
                    {
                        socketId: socket.id,
                        vehicleType: data.vehicleType || 'car'
                    }
                );

                // 2. Asynchronous MongoDB persistence
                captainModel.findByIdAndUpdate(userId, {
                    location: {
                        type: 'Point',
                        coordinates: [location.longitude, location.latitude]
                    }
                }).catch(err => console.warn('Mongo location update error:', err.message));

                const payload = {
                    captainId: userId,
                    location: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        heading: location.heading || 0,
                        speed: location.speed || 0
                    },
                    rideId
                };

                // If userSocketId is directly provided, emit directly to user
                if (userSocketId) {
                    sendMessageToSocketId(userSocketId, {
                        event: 'driver-location-update',
                        data: payload
                    });
                }

                // Also broadcast to ride room if rideId is present
                if (rideId) {
                    io.to(`ride_${rideId}`).emit('driver-location-update', payload);
                }
            } catch (err) {
                console.error('Error updating captain location:', err.message);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            if (socket.userType === 'captain' && socket.userId) {
                redisService.removeCaptainLocation(socket.userId);
            }
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(`📢 [sendMessageToSocketId] Event: ${messageObject.event}, SocketId: ${socketId}`);
    
    if (!socketId) {
        console.error('❌ [sendMessageToSocketId] No socketId provided!');
        return;
    }

    if (io) {
        console.log(`✅ [sendMessageToSocketId] Emitting to socket: ${socketId}`);
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.error('❌ [sendMessageToSocketId] Socket.io not initialized');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };