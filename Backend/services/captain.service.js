const captainModel = require('../models/captain.model');

module.exports.createCaptain = async({
    firstName, lastName, email, password, vehicle
}) => {
    if(!firstName || !email || !password || !vehicle) {
        throw new Error('All fields are required');
    }

    const captian = await captainModel.create({
        fullName: {
            firstName,
            lastName
        },
        email,
        password,
        vehicle:{
            color: vehicle.color,
            numberPlate: vehicle.numberPlate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        }
    })

    return captian;
}