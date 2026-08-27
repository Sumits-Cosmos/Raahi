const express = require('express')
const router = express.Router();
const {body, query} = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middleware/auth.middleware')

router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({min:3}).withMessage('Invalid PickUp address'),
    body('destination').isString().isLength({min:3}).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn(['auto', 'car', 'bike']).withMessage('Invalid vehicle type'),
    rideController.createRide
)

router.get('/get-fare', 
    authMiddleware.authUser,
    query('pickup').isString().isLength({min:3}).withMessage('Invalid PickUp address'),
    query('destination').isString().isLength({min:3}).withMessage('Invalid destination address'),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isString().withMessage('Invalid ride ID'),
    body('captainId').isString().withMessage('Invalid captain ID'),
    rideController.confirmRide
)

router.post('/verify-otp',
    authMiddleware.authCaptain,
    body('rideId').isString().withMessage('Invalid ride ID'),
    body('otp').isString().isLength({min:6, max:6}).withMessage('OTP must be 6 digits'),
    rideController.verifyOtp
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isString().withMessage('Invalid ride ID'),
    rideController.endRide
)

router.post('/cancel-ride',
    authMiddleware.authAny,
    body('rideId').isString().withMessage('Invalid ride ID'),
    rideController.cancelRide
)

module.exports = router;