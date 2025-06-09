const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullName: {
        firstName:{
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long']
        },
        lastName: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false 
    },
    socketId: {
        type:String
    }
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this.id}, process.env.JWT_SECRET)
    return token;
}

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashedPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;