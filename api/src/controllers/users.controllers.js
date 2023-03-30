const { User, Review } = require('../db');
const users = require('../utils/data-users');
const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/generateRefreshToken');

const newUser = async (firstname, lastname, email, mobile, password, role, nationality, status) => {
    
    const user = await User.findOne({where: {email: email}})
  
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
        status
    });

    return userPost;
};

const getAllUsers= async()=> {

    const users= await User.findAll();
        
    return (users.map(user=> ({
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

      if (!userReviews) throw new Error("User doesnt have any review")
    
      return userReviews;
}
    







//cargo users de prueba
const createUSERSDb = async (req,res) => {
    try {
     
      await Promise.all(users.map(async (el) => { 
        const newuser = await User.create(el);
      })); 

     res.status(201).send("Users de prueba Creados")
    }
    catch(e) {res.status(404).json(console.log(e))}
}


module.exports = { newUser, getAllUsers, loginUser, logout, getUserReviews, createUSERSDb };