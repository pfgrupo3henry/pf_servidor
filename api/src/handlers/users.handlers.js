const { newUser, getAllUsers, loginUser, logout, getUserReviews } = require('../controllers/users.controllers');
const { User } = require('../db');


const createUser = async (req, res) => {
    const { firstname, lastname, email, mobile, password, role, nationality, status } = req.body;
    try {
        const user = await newUser(firstname, lastname, email, mobile, password, role, nationality, status);
        res.status(201).send({userId: user.id});

    } catch (error) {
        res.status(400).json({ message: 'Error in user creation', error: error.message});
      }
};  

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id, {
            attributes: ["firstname", "lastname", "email", "mobile", "role", "nationality", "img"]
            });
        if(!user) {res.status(400).json({ message: 'The id of the user doest exist'})}
        else {res.status(201).send(user);}

    } catch (error) {
        res.status(400).json({ message: 'Error to locate User', error: error});
      }
};  


const allUsers= async(req, res)=>{
    try {
        const allUsers= await getAllUsers();
        res.status(200).send(allUsers);

    } catch(error) {
        res.status(400).json({ message: 'Can not get all users', error: error.message});
    }
}

const loginhandler= async(req, res)=> {
    const { email, password } = req.body;
    
    try{
        const loginData= await loginUser(email, password);
         res.cookie('refreshToken', loginData.token, {
                httpOnly: true,
                maxAge: 72*60*60*1000,
            })
       
        res.status(201).send(loginData);
    } catch (error) {
        res.status(400).json({ message: 'Error in user login', error: error.message});
    }
}

const logoutHandler= async (req, res) => {

    const cookie= req.cookies;
    try{
        if (!cookie.refreshToken) throw new Error('No Refresh Token in Cookies');
        const refreshToken= cookie.refreshToken;
        const userLogOut= await logout(refreshToken);
        
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        res.status(200).send({userId:userLogOut}); 
    } catch (error) {
        res.status(400).json({ message: 'Error in user logout', error: error.message})
    }
}
        

const getUserReviewsHandler= async (req, res) => {
    const { id } = req.params;
    // if (Number(req.user.id) !== Number(id)) throw new Error("You cant access to that information");  //ver si es necesario, lo que controlo es que un user logueado no acceda a los reviews de otro user 
    try {
        const reviews= await getUserReviews(id);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(400).json({ message: 'Error getting Users Reviews', error: error.message })
    }
};



module.exports = { createUser, allUsers, loginhandler, logoutHandler, getUserById, getUserReviewsHandler };