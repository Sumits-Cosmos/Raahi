const UserModel = require('../models/user.model');


module.exports.createUser = async ({
    firstName, lastName, email, password
}) => {
    if(!firstName  || !email || !password) {
        throw new Error('All feilds are required');
    }
    const user = await UserModel.create({
        fullName: {
            firstName,
            lastName
        },
        email,
        password
    });
    return user;
}