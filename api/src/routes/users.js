const Router = require('express');
const { getUserById, allUsers, createUser, loginhandler, logoutHandler} = require('../handlers/users.handlers');
const {createUSERSDb }= require('../controllers/users.controllers');
const router = Router();


// GET ROUTES:
router.get("/all-users", allUsers);

//POST ROUTES:
// router.post("/cargadeusers", createUSERSDb);
router.post("/register", createUser);
router.get("/login", loginhandler);
router.get("/logout", logoutHandler);

module.exports = router
