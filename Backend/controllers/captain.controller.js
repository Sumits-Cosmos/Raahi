const { validationResult } = require('express-validator');
const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");


module.exports.registerCaptain = (async (req, res) => {
 const errors = validationResult(req);
 if(!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
 }
 
 const {fullName, email, password, vehicle} = req.body;
 
 const isCaptainExist = await captainModel.findOne({email});
 if(isCaptainExist){
    return res.status(400).json({
        message: "Captain with this email already exists"
    })
 }

 const hashedPassword = await captainModel.hashedPassword(password);

 const captian = await captainService.createCaptain({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashedPassword,
    color: vehicle.color,
    numberPlate: vehicle.numberPlate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
    // location:{
    //     ltd: location.ltd,
    //     lng: location.lng
    // }

 });

 const token = captian.generateAuthToken();
 res.status(201).json({token, captian});

})

