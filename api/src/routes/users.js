const Router = require('express');
const { getAllUsers, getUserById, createUser } = require('../handlers/users.handlers');
const router = Router();


router.get('/', getAllUsers);
router.get('/:id', getUserById);
//router.put('/modify', modifyUser);
router.post("/", createUser);


module.exports = router