const Router = require('express');
const { getUserById, allUsers, createUser, loginhandler, logoutHandler, getUserReviews} = require('../handlers/users.handlers');
const {createUSERSDb }= require('../controllers/users.controllers');
const { isAdmin } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = Router();


// GET ROUTES:
router.get("/all-users", authMiddleware, isAdmin, allUsers);
router.get("/logout", logoutHandler);
router.get('/:id', authMiddleware, isAdmin, getUserById); 
router.get("/:id/review", authMiddleware, getUserReviews);
//POST ROUTES:
// router.post("/cargadeusers", createUSERSDb);
router.post("/register", createUser);
router.post("/login", loginhandler);





module.exports = router