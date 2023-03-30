const Router = require('express');

const { allUsers, createUser, loginhandler, logoutHandler} = require('../handlers/users.handlers');
const {createUSERSDb }= require('../controllers/users.controllers');
const { isAdmin } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = Router();


// GET ROUTES:
router.get("/all-users", authMiddleware, isAdmin, allUsers);
/* router.get('/:id', getUserById); */

//POST ROUTES:
// router.post("/cargadeusers", createUSERSDb);
router.post("/register", createUser);
router.post("/login", loginhandler);
router.get("/logout", logoutHandler);


//router.put('/modify', modifyUser);


module.exports = router