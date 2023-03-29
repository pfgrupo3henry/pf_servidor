const { User } = require('../db');

const newUser = async (firstname, lastname, email, mobile, password, role, nationality, status) => {
    
    const user = await User.findOne({where: {email: email}})
  
    if(user) {
        throw ("This e-mail is alredy in use, please use other")
    }

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