const { User, Review, Videogame } = require('../db');
const users = require('../utils/data-users');
const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/generateRefreshToken');
const { hashPassword } = require ('../config/hashFunction');

const newUser = async (firstname, lastname, email, mobile, password, role, nationality, status, img) => {
    
    const user = await User.findOne({where: {email: email}});
  
    if(user) {
        throw new Error("This e-mail is already in use, please use another email")
    }

    const userPost = await User.create({
        firstname,
        lastname,
        email,
        mobile,
        password,
        role,
        nationality,
        status, 
        img
    });
    
    const passwordHashed= await hashPassword(userPost);
    const newPostUser= await userPost.update({password: passwordHashed});
    return newPostUser.dataValues;
};

const newUserAuth0= async (email, img) => {
    const user= await User.findOne( { where: { email: email } });
    if (user) {
        throw new Error("This e-mail is already in use, please insert another email")
    };

    const userPost= await User.create({
        email: email,
        img: img
    });

    return userPost;
};

const getAllUsers= async()=> {

    const users= await User.findAll();
        
    return (users.map(user=> ({
        id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: user.password,
            nacionality: user.nacionality,
            role: user.role,
            status: user.status
        })));
       
};


const loginUser= async(email, password)=> {
   
        const findUser= await User.findOne({where: {email: email}});
        
        if (findUser && await findUser.isPasswordMatched(password, findUser.password)){
            const refreshToken= generateRefreshToken(findUser.id);
            await User.update({
                refreshToken: refreshToken
            }, {
                where: {id: findUser.id}
            });
            
            const userDataLogin= {
                _id: findUser.id,
                firstname: findUser.firstname,
                lastname: findUser.lastname,
                email: findUser.email,
                nacionality: findUser.nacionality,
                token: refreshToken,
            }
         
            return userDataLogin;

        } else { 
            throw new Error("Invalid Credentials");
        }

}

const logout= async(refreshToken)=>{
 
    const user= await User.findOne({where: {refreshToken: refreshToken}});
    
    if (user) {   
        await User.update({
        refreshToken: ""
        }, {
        where: {id: user.id}
        });
    } 
    return user.id; 
}


const getUserReviews= async (id) => {
    const userReviews= await Review.findAll({ 
        where: {
            userId: id 
        },
        include: [
            { model: Videogame }
        ],
      });
      if (userReviews.length<1) throw new Error("User doesnt have any review")
    
      return userReviews;
}

    
const promoteUser= async (id) => {
    const findUser= await User.findByPk(id);

    if(findUser.role === "Admin") throw new Error ("This user is already admin");
    
    const modifiedUser= await findUser.update({
          role: "Admin"
    });
    
    return modifiedUser;
} 

const blockUser= async (id) => {
    const findUser= await User.findByPk(id);
    if (!findUser) throw new Error ('Cannot find User with that ID');

    const blockUser= await findUser.update({
        status: 'Disabled',
    });
    return blockUser;
};

const unblockUser= async (id) => {
    const findUser= await User.findByPk(id);
    if (!findUser) throw new Error ('Cannot find User with that ID');

    const unblockUser= await findUser.update({
        status: 'Active',
    });
    return unblockUser;
}





module.exports = { newUser, getAllUsers, loginUser, logout, getUserReviews, newUserAuth0, promoteUser, blockUser, unblockUser };