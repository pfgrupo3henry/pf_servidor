const Router = require('express');
const router = Router();
const {createReview, getReviewsOfGame} = require("../handlers/review.handlers")


router.post("/", createReview);

router.get("/:gameId", getReviewsOfGame);




module.exports = router