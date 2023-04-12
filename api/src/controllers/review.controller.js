const { Review } = require("../models/Review");

const editReview = async (id, status) => {
  
  let review = await Review.findById(id);

  await review.update({
    status,
  });

  return review;
};

module.exports = { editReview };