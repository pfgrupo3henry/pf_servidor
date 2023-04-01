const Router = require('express');

const { allUsers, createUser, loginhandler, logoutHandler, getUserByEmail, getUserReviewsHandler, userAuth0Create, modifyUser } = require('../handlers/users.handlers');
const {createUSERSDb }= require('../controllers/users.controllers');
const { isAdmin } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = Router();


// GET ROUTES:
router.get("/logout", logoutHandler);
router.post("/login", loginhandler);
router.get("/all-users", allUsers);
router.get("/:email", getUserByEmail);
router.get("/:id/review", authMiddleware, getUserReviewsHandler);

//POST ROUTES:
// router.post("/cargadeusers", createUSERSDb);
router.post("/register", createUser);
router.post("/auth0", userAuth0Create);

//PUT ROUTES:
router.put("/modify/:email", modifyUser);







//router.put('/modify', modifyUser);


module.exports = router