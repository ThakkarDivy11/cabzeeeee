const socketIO = require('socket.io');
const Ride = require('./models/Ride');
const User = require('./models/User');

let io;

const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: [
                process.env.FRONTEND_URL,
                'https://cabzeeeee.vercel.app',
                'http://localhost:3000'
            ].filter(Boolean),
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('✅ New socket connection:', socket.id);

        // Join a ride room to receive updates
        socket.on('join-ride', (rideId) => {
            socket.join(`ride-${rideId}`);
            console.log(`🚗 Socket ${socket.id} joined ride room: ride-${rideId}`);
        });

        // Leave a ride room
        socket.on('leave-ride', (rideId) => {
            socket.leave(`ride-${rideId}`);
            console.log(`🚪 Socket ${socket.id} left ride room: ride-${rideId}`);
        });

        // Driver sends location update
        socket.on('driver-location-update', async (data) => {
            const { rideId, latitude, longitude } = data;

            try {
                const ride = await Ride.findById(rideId);
                if (ride) {
                    // Update current location
                    ride.currentDriverLocation = {
                        latitude,
                        longitude,
                        timestamp: new Date()
                    };

                    // Add to location history
                    ride.locationHistory.push({
                        latitude,
                        longitude,
                        timestamp: new Date()
                    });

                    await ride.save();

                    // Broadcast to all clients in the ride room
                    io.to(`ride-${rideId}`).emit('location-updated', {
                        latitude,
                        longitude,
                        timestamp: new Date()
                    });

                    console.log(`📍 Location updated for ride ${rideId}: [${latitude}, ${longitude}]`);
                }
            } catch (error) {
                console.error('Error updating driver location:', error);
            }
        });

        // Ride status changed
        socket.on('ride-status-changed', (data) => {
            const { rideId, status } = data;
            io.to(`ride-${rideId}`).emit('status-updated', { status });
            console.log(`📢 Ride ${rideId} status changed to: ${status}`);
        });

        // OTP verified
        socket.on('otp-verified', (data) => {
            const { rideId } = data;
            io.to(`ride-${rideId}`).emit('otp-verification-success', data);
            console.log(`✅ OTP verified for ride ${rideId}`);
        });

        // AI ChatBot bookings
        socket.on('book-ride', async (data) => {
            const { pickup, destination, datetime, source } = data;
            console.log(`🤖 AI Booking Request: from ${pickup} to ${destination} at ${datetime}`);

            try {
                // Find an available driver
                const availableDriver = await User.findOne({
                    role: 'driver',
                    driverStatus: 'online'
                });

                // Get a rider ID (ideally the one logged in, but fallback to any rider for simulation)
                const rider = await User.findOne({ role: 'rider' });

                const ride = new Ride({
                    rider: rider ? rider._id : '65bbae123456789012345678',
                    pickupLocation: {
                        address: pickup,
                        coordinates: [72.8777, 19.0760]
                    },
                    dropLocation: {
                        address: destination,
                        coordinates: [72.8777, 19.0760]
                    },
                    fare: Math.floor(Math.random() * 500) + 100,
                    status: availableDriver ? 'accepted' : 'pending',
                    driver: availableDriver ? availableDriver._id : null,
                    vehicleType: availableDriver?.vehicleInfo?.vehicleType || 'car',
                    specialInstructions: `Booked via AI Assistant on ${datetime}`,
                    acceptedAt: availableDriver ? new Date() : null,
                    pickupOTP: Math.floor(1000 + Math.random() * 9000).toString()
                });

                // If driver assigned, mark them as busy
                if (availableDriver) {
                    availableDriver.driverStatus = 'busy';
                    await availableDriver.save();
                    console.log(`🚖 Driver ${availableDriver.name} auto-assigned to AI ride`);
                }

                await ride.save();

                // Response back to the bot
                socket.emit('ride-booked-confirmed', {
                    success: true,
                    rideId: ride._id,
                    driverName: availableDriver ? availableDriver.name : 'Searching...',
                    fare: ride.fare
                });

            } catch (error) {
                console.error('❌ AI Booking Error:', error);
                socket.emit('ride-booked-confirmed', { success: false, message: error.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected:', socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initializeSocket, getIO };
