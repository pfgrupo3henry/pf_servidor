const { newUser } = require('../controllers/users.controllers');
const {User} = require("../db")

const createUser = async (req, res) => {
    const { firstname, lastname, email, mobile, password, role, nationality, status } = req.body;
    try {
        const user = await newUser(firstname, lastname, email, mobile, password, role, nationality, status);
        res.status(201).send({userId: user.id});

    } catch (error) {
        res.status(400).json({ message: 'Error in user creation', error: error});
      }
};  


const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if(!user) {res.status(400).json({ message: 'The id of the user doest exist'})}
        else {res.status(201).send(user);}

    } catch (error) {
        res.status(400).json({ message: 'Error to locate User', error: error});
      }
};  

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(201).send(users);

    } catch (error) {
        res.status(400).json({ message: 'Error to locate Users'});
      }
};  

module.exports = { createUser, getUserById, getAllUsers };