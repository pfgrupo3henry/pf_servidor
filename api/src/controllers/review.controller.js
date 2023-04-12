const {Review} = require('../db');

const editReview = async (id, status) => {
  
  let review = await Review.findByPk(id);

  await review.update({
    status,
  });

  return review;
};

module.exports = { editReview };