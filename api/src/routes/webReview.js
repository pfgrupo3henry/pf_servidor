const Router = require('express');
const router = Router();
const { createWebReview, getReviewsOfWeb, putWebReview } = require("../handlers/webReview.handlers")


router.post("/", createWebReview);

router.get("/:userId", getReviewsOfWeb);

router.put("/:id", putWebReview);



module.exports = router