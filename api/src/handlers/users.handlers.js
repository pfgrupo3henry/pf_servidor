const { newUser, getAllUsers, loginUser } = require('../controllers/users.controllers');

const createUser = async (req, res) => {
    const { firstname, lastname, email, mobile, password, role, nationality, status } = req.body;
    try {
        const user = await newUser(firstname, lastname, email, mobile, password, role, nationality, status);
        res.status(201).send({userId: user.id});

    } catch (error) {
        res.status(400).json({ message: 'Error in user creation', error: error.message});
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

const loginhandler= async(req, res)=>{
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

module.exports = { createUser, allUsers, loginhandler };