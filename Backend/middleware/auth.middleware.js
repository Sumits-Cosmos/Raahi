const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const blackListTokenModel = require('../models/blackListToken.model');
const captainModel = require('../models/captain.model');



module.exports.authUser = async (req, res, next) => {

    const token = req.cookie?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    } 
  
    const isBlackListed = await blackListTokenModel.findOne({token: token})
    
    if(isBlackListed){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decode._id)

        req.user = user;
        return next();

    }catch(err){
        return res.status(401).json({ message: 'Unauthorized' });
    }

};

module.exports.authCaptain = async (req, res, next) => {
   const token = req.cookie?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    } 
  
    const isBlackListed = await blackListTokenModel.findOne({token: token})
    
    if(isBlackListed){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decode._id)

        req.captain = captain;
        return next();

    }catch(err){
        return res.status(401).json({ message: 'Unauthorized' });
    }
}