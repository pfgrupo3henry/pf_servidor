const { Review } = require("../models/Review");

const editReview = async (userId, videogameId, comment, rate, status) => {
  
  let review = await Review.findById(userId);

  await review.update({
    videogameId,
    comment,
    rate,
    status,
  });

  return review;
};

module.exports = { editReview };