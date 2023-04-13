const { WebReview } = require('../db');

const editWebReview = async (id, status) => {
  
  let reviewOfWebUser = await WebReview.findByPk(id);

  await reviewOfWebUser.update({
    status,
  });

  return reviewOfWebUser;
};

module.exports = { editWebReview };