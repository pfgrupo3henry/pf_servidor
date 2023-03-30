const Router = require('express');
const { getUserById, allUsers, createUser, loginhandler, logoutHandler} = require('../handlers/users.handlers');
const {createUSERSDb }= require('../controllers/users.controllers');
const { isAdmin } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = Router();


// GET ROUTES:
router.get("/all-users", authMiddleware, isAdmin, allUsers);

//POST ROUTES:
// router.post("/cargadeusers", createUSERSDb);
router.post("/register", createUser);
router.post("/login", loginhandler);
router.get("/logout", logoutHandler);

module.exports = router