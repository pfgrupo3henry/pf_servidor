const { User, Review, Videogame } = require('../db');
const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/generateRefreshToken');
const { hashPassword } = require ('../config/hashFunction');
const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: "dapq4icmj",
  api_key: "182849148671358",
  api_secret: "LiNdU8c3mGXxCnRed_xiA9xQtLk"
});


const newUser = async (firstname, lastname, email, mobile, password, role, nationality, status, img) => {
    
    const user = await User.findOne({where: {email: email}});
  
    if(user) {
        throw new Error("This e-mail is already in use, please use another email")
    }

    if(img){
    // Generate The output url    
    const res = await cloudinary.uploader.upload(`${img[0]}`, {folder: "img_profile", public_id: `profile-${email}`})

    img[0] = res.url
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

const newUserAuth0= async (email, img, firstname) => {
    const user= await User.findOne( { where: { email: email } });
    if (user) {
        throw new Error("This e-mail is already in use, please insert another email")
    };

    const userPost= await User.create({
        email: email,
        img: img,
        firstname: firstname
    });

    return userPost;
};

const getAllUsers= async()=> {

    const users= await User.findAll();
    
    return users
};


const loginUser= async(email, password)=> {
   
        const findUser= await User.findOne({where: {email: email}});
        console.log(findUser);
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
                img: findUser.img,
                nacionality: findUser.nacionality,
                status: findUser.status,
                role: findUser.role,
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

const changeAdminRole= async (id) => {
    const findUser= await User.findByPk(id);

    if(findUser.role === "User") throw new Error ("This user has 'user' role");
    
    const modifiedUser= await findUser.update({
          role: "User"
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





module.exports = { newUser, getAllUsers, loginUser, logout, getUserReviews, newUserAuth0, promoteUser, blockUser, unblockUser, changeAdminRole };