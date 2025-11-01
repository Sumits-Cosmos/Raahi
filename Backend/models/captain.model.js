const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const captainSchema = new mongoose.Schema({
    fullName: {
        firstName:{ 
            type:String,
            required: true ,
            minlength: [3, 'firstName must be at least 3 characters long'],
        },
        lastName: {
            type: String,
            minlength: [3, 'lastName must be at least 3 characters long'],
        },
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [ /^\S+@\S+\.\S+$/, 'Please enter a valid email' ],
    },
    password: {
        type: String,
        required: true,
        minlength: [3, 'Password must be at least 3 characters long'],
        select: false,
        },
    socketId: {
        type: String
    },

    status: {
       type: String,
       enum: ['active', 'inactive'],
       default: 'inactive',
    },

    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters long'],
        },

        numberPlate: {
            type: String,
            required: true,
            minlength: [3, 'Number Plate must be at least 3 characters long'],
        },
        
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
        },

        vehicleType: {
            type: String,   
            required: true,
            enum: ['car', 'bike', "auto"],
        }
    },

    location: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        },

    }

})


captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET)
    return token;
}


captainSchema.methods.comparePassword = async function(password){
     return await bcrypt.compare(password, this.password)
}

captainSchema.statics.hashedPassword = async function(password){
    return await bcrypt.hash(password, 10)
}

const captainModel = mongoose.model('Captain', captainSchema);
module.exports = captainModel;