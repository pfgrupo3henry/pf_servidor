const { newUser } = require('../controllers/users.controllers');

const createUser = async (req, res) => {
    const { firstname, lastname, email, mobile, password, role, nationality, status } = req.body;
    try {
        
        const user = await newUser(firstname, lastname, email, mobile, password, role, nationality, status);
        
        res.status(201).send({userId: user.id});

    } catch (error) {
        
        res.status(400).json({ message: 'Error in user creation', error: error});
      }
};  

module.exports = { createUser };