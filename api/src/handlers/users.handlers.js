const { newUser, getAllUsers, loginUser, logout, getUserReviews, newUserAuth0 } = require('../controllers/users.controllers');
const { User } = require('../db');


const createUser = async (req, res) => {
    const { firstname, lastname, email, mobile, password, role, nationality, status, img } = req.body;
    try {
        const user = await newUser(firstname, lastname, email, mobile, password, role, nationality, status, img);
        res.status(201).send({userId: user.id});

    } catch (error) {
        res.status(400).json({ message: 'Error in user creation', error: error.message});
      }
};  

const getUserByEmail = async (req, res) => {
    
    const { email } = req.params;
    try {
        const user = await User.findOne({where: {email: email}});
        if(!user) {res.status(400).json({ message: 'The mail of the user doest exist'})}
        else {res.status(201).send(user)}

    } catch (error) {
        res.status(400).json({ message: 'Error to locate User', error: error});
      }
};  

const userAuth0Create= async (req, res) => {
    const { email, img }= req.body;
    try{
        const user= await newUserAuth0(email, img);
        res.status(201).send( { userId: user.id });
    } catch (error) {
        res.status(400).json({ message: 'Error in user creation', error: error.message })
    }
};

const modifyUser= async (req, res) => {

    try {
        let { email }= req.params;
        let { firstname, lastname, nationality, mobile, img }= req.body;

        const user= await User.findOne({
            where: {
                email: email
            }
        });
        
        if(!user){
            return res.status(404).json( { message: 'Error in user creation' })
        };

        user.update({
            firstname: firstname,
            lastname: lastname,
            nationality: nationality,
            mobile: mobile,
            img: img
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(401).json({ message: error });
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
            });
       
         res.status(201).send(loginData);
    } catch (error) {
        res.status(400).json({ message: 'Error in user login', error: error.message});
    }
}

const logoutHandler= async (req, res) => {

    const cookie= req.cookies;
    try{
        if (!cookie.refreshToken) throw new Error('No RefreshToken in Cookies');
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


const promoteOrBlockUser= async (req, res)=> {
    const { id } = req.params;
    const { promote, block } = req.body;
   
    try {
        if (promote === undefined && block === undefined) throw new Error ('You must send if you want to promote or block/unblock the user');
        if (promote) {
            const userPromoted= await promoteUser(id);
            res.status(200).json({ message: "User has been promoted to administrator successfully", user: userPromoted });
        } else if (block) {
            const userBlocked= await blockUser(id);
            res.status(200).json({ message: "User has been blocked successfully", user: userBlocked });
        } else if (block===false) {
            const unblockedUser= await unblockUser(id);
            res.status(200).json({ message: "User has been unblocked successfully", user: unblockedUser });
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



module.exports = { createUser, allUsers, loginhandler, logoutHandler, getUserByEmail, getUserReviewsHandler, userAuth0Create, modifyUser, promoteOrBlockUser };