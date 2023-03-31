const Router = require('express');

const { allUsers, createUser, loginhandler, logoutHandler, getUserById, getUserReviewsHandler } = require('../handlers/users.handlers');
const {createUSERSDb }= require('../controllers/users.controllers');
const { isAdmin } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = Router();


// GET ROUTES:
router.get("/all-users", authMiddleware, isAdmin, allUsers);
router.get('/:id', authMiddleware, getUserById);
router.get("/logout", logoutHandler);
router.get("/:id/review", authMiddleware, getUserReviewsHandler);
//POST ROUTES:
// router.post("/cargadeusers", createUSERSDb);
router.post("/register", createUser);
router.post("/login", loginhandler);






//router.put('/modify', modifyUser);


module.exports = router