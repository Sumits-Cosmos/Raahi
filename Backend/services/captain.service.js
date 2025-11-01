const captainModel = require('../models/captain.model');

module.exports.createCaptain = async({
    firstName, lastName, email, password, color, numberPlate, capacity, vehicleType
}) => {
    if(!firstName || !email || !password || !color 
        || !numberPlate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }

    const captian = await captainModel.create({
        fullName: {
            firstName,
            lastName
        },
        email,
        password,
        vehicle: {
            color,
            numberPlate,
            capacity,
            vehicleType
        }
    })

    return captian;
}