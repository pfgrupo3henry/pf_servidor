const Router = require('express');
const router = Router();
const {createReview, getReviewsOfGame, putReview} = require("../handlers/review.handlers")


router.post("/", createReview);

router.get("/:gameId", getReviewsOfGame);

router.put("/:id", putReview);



module.exports = router