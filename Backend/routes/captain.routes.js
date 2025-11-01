const express = require('express');
const { body } = require("express-validator");
const captianController = require('../controllers/captain.controller');
const authMiddleware = require('../middleware/auth.middleware')
const router = express.Router();


router.post('/register',
    [
     body('email').isEmail().withMessage('Invalid Email'),
      body('fullName.firstName').isLength({min:3}).withMessage('First name must be at least 3 character long'),
      body('password').isLength({min:3}).withMessage('Password must be at least 6 character long'),
      body('vehicle.color').isLength({min:3}).withMessage('Color must be at least 3 char long'),
      body('vehicle.numberPlate').isLength({min:3}).withMessage('numberPlate must be at least 3 char long'),
      body('vehicle.capacity').isInt({min:1}).withMessage('Capacity must be at least 1'),
      body('vehicle.vehicleType').isIn(['car', 'bike', 'auto']).withMessage('Invalid vehicle type')
    ],
captianController.registerCaptain);
router.post('/login',[
   body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 character long')
], captianController.loginCaptain);

router.get('/profile', authMiddleware.authCaptain  ,captianController.getCaptainProfile)
router.get('/logout', captianController.logoutCaptain);

module.exports = router;