const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const blackListTokenModel = require('../models/blackListToken.model');



module.exports.authMiddleware = async (req, res, next) => {
    const token = req.cookie.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    } 

    const isBlackListed  = await blackListTokenModel.findOne({token});
    if (isBlackListed) {
        return res.status(401).json({ message: 'unauthorised' });
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decode._id)

        req.user = user;
        return next();

    }catch(err){
        return res.status(401).json({ message: 'Unauthorized' });
    }

}