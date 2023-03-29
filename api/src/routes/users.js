const Router = require('express');
const { getUsers, getUserById, createUser } = require('../handlers/users.handlers');
const router = Router();


//router.get('/', getUsers);
//router.get('/:id', getUserById);
//router.put('/modify', modifyUser);
router.post("/", createUser);


module.exports = router