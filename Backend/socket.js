const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

            socket.on('join', async (data) => {
            const { userId, userType } = data;
            
            console.log(`🔌 [JOIN EVENT] UserType: ${userType}, UserId: ${userId}, SocketId: ${socket.id}`);

            try {
                if (userType === 'user') {
                    const user = await userModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
                    console.log(`✅ [JOIN] User socketId updated: ${user?.socketId}`);
                } else if (userType === 'captain') {
                    const captain = await captainModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
                    console.log(`✅ [JOIN] Captain socketId updated: ${captain?.socketId}`);
                }
            } catch (err) {
                console.error(`❌ [JOIN ERROR]:`, err.message);
            }
        });


        // ... (rest of your socket.on handlers)
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
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        type: 'Point',
                        coordinates: [location.longitude, location.latitude]
                    }
                });

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