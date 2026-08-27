const rideService = require('../services/ride.service')
const { validationResult } = require('express-validator');
const mapService = require('../services/map.service')
const {sendMessageToSocketId} = require('../socket');
const rideModel = require('../models/ride.model');



module.exports.createRide = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
         return res.status(400).json({ errors: errors.array() });
    }

    const {userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({user: req.user._id, pickup, destination, vehicleType});
        
        const pickupCoordiantes = await mapService.getAddressCoordinate(pickup);
        console.log('New ride created with pickup coordinates:', pickupCoordiantes);
        console.log(`🎫 OTP for ride ${ride._id}: ${ride.otp}`);

        const captainsInRadius = await mapService.getCaptainsInRadius(pickupCoordiantes.latitude, pickupCoordiantes.longitude, 2);
        console.log(`Captains found: ${captainsInRadius.length} in 2 km radius.`);
        
        if (captainsInRadius.length === 0) {
            console.warn('⚠️ No captains found in 2 km radius. Searching in larger radius...');
        }

        const rideWithUser = await rideModel.findOne({_id: ride._id}).populate('user').select('+otp');

        captainsInRadius.forEach(captain => {
            console.log(`✓ Sending ride notification to socket ID: ${captain.socketId}, Captain: ${captain.fullName.firstName}`);
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })
        })
        
        console.log(`✓ Ride notifications sent to ${captainsInRadius.length} captains`);
        
        // Send ride with OTP to user
        return res.status(201).json(rideWithUser);
 

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: err.message})
    }

}

module.exports.getFare = async(req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {pickup, destination} = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
       return res.status(500).json({msg: err.message})
    }
}

module.exports.confirmRide = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, captainId } = req.body;

    try {
        const ride = await rideModel.findByIdAndUpdate(
            rideId,
            { captain: captainId, status: 'accepted' },
            { new: true }
        ).populate('user').populate('captain').select('+otp');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        console.log(`✓ Ride ${rideId} confirmed by Captain ${captainId}`);
        
        // Send socket event to user to notify ride was accepted
        console.log(`📢 Notifying user (socketId: ${ride.user.socketId}) that ride was confirmed`);
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        res.status(200).json(ride);
    } catch (err) {
        console.error('Error confirming ride:', err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.verifyOtp = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.body;

    try {
        // Find ride with OTP field included
        const ride = await rideModel.findOne({_id: rideId}).select('+otp').populate('user').populate('captain');

        if (!ride) {
            console.log(`❌ Ride not found: ${rideId}`);
            return res.status(404).json({ message: 'Ride not found' });
        }

        console.log(`🔐 [verifyOtp] Received OTP: ${otp}, Stored OTP: ${ride.otp}`);

        // Verify OTP matches
        if (ride.otp !== otp) {
            console.log(`❌ [verifyOtp] OTP mismatch for ride ${rideId}`);
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP is correct - update ride status to 'ongoing'
        ride.status = 'ongoing';
        await ride.save();

        console.log(`✅ [verifyOtp] OTP verified successfully for ride ${rideId}. Status updated to 'ongoing'`);

        // Notify user that ride has started
        console.log(`📢 [verifyOtp] Notifying user (socketId: ${ride.user.socketId}) that ride started`);
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        // Notify captain that OTP was verified
        console.log(`📢 [verifyOtp] Notifying captain (socketId: ${ride.captain.socketId}) that OTP was verified`);
        sendMessageToSocketId(ride.captain.socketId, {
            event: 'otp-verified',
            data: ride
        });

        return res.status(200).json({ message: 'OTP verified successfully', ride });
    } catch (err) {
        console.error('❌ [verifyOtp ERROR]:', err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideModel.findOne({
            _id: rideId,
            captain: req.captain._id
        }).populate('user').populate('captain').select('+otp');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.status === 'completed') {
            return res.status(400).json({ message: 'Ride is already completed' });
        }

        ride.status = 'completed';
        await ride.save();

        console.log(`🏁 [endRide] Ride ${rideId} marked as completed by Captain ${req.captain._id}`);

        // Notify user that ride is completed with full ride details for payment
        if (ride.user?.socketId) {
            console.log(`📢 [endRide] Emitting ride-completed to user socket: ${ride.user.socketId}`);
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-completed',
                data: ride
            });
        }

        return res.status(200).json({ message: 'Ride completed successfully', ride });
    } catch (err) {
        console.error('❌ [endRide ERROR]:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.cancelRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, reason } = req.body;

    try {
        const ride = await rideModel.findById(rideId).populate('user').populate('captain');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        ride.status = 'cancel';
        await ride.save();

        const cancelledBy = req.user ? 'user' : 'captain';
        console.log(`🚫 [cancelRide] Ride ${rideId} cancelled by ${cancelledBy}. Reason: ${reason || 'Not specified'}`);

        // If user cancelled, notify captain
        if (cancelledBy === 'user' && ride.captain?.socketId) {
            sendMessageToSocketId(ride.captain.socketId, {
                event: 'ride-cancelled',
                data: { ride, cancelledBy, reason }
            });
        }

        // If captain cancelled, notify user
        if (cancelledBy === 'captain' && ride.user?.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-cancelled',
                data: { ride, cancelledBy, reason }
            });
        }

        return res.status(200).json({ message: 'Ride cancelled successfully', ride });
    } catch (err) {
        console.error('❌ [cancelRide ERROR]:', err);
        return res.status(500).json({ message: err.message });
    }
};