const { User } = require('../models/User');

const newUser = async (firstname, lastname, email, mobile, password, role, nationality, status) => {
    const userPost = await User.create({
        firstname,
        lastname,
        email,
        mobile,
        password,
        role,
        nationality,
        status
    });

    return userPost;
};

module.exports = { newUser };