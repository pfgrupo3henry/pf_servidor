const { WebReview, User } = require('../db');
const { editWebReview } = require('../controllers/webReview.controller');

const createWebReview = async (req, res) => {

    const { userId } = req.body

    try { 
        await WebReview.create(req.body);
        
        const allWebReviews = await WebReview.findAll({ where: { userId: userId } })

        res.status(201).json(allWebReviews);

    } catch (error) {

        res.status(400).json({ error: "Error al crear la Review" });
    }
};

const getAllWebReviews = async (req, res) => {
    try {
      const webReviews = await WebReview.findAll({
        include: [{ model: User, as: 'userInfo' }]
      });
      res.status(200).json(webReviews);
    } catch (error) {
      res.status(400).json({ error: "Error al traer las reviews", message: error });
    }
  };


const getReviewsOfWeb = async (req, res) => {

    const { userId } = req.params;
    try { 
        if(userId){

            const webReview = await WebReview.findAll({
                where: { userId: userId },
                include: [{ model: User, as: 'userInfo' }]
              });
        
        if(!webReview) {return new Error("no existen reviews de este usuario")}
        
        res.status(201).json(webReview);

        }
        
    } catch (error) {
        res.status(400).json({ error: "Error al traer las reviews", message: error });
    }
};

const putWebReview = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const editedReview = await editWebReview(id, status);
        res.status(200).json(editedReview);
    } catch (error) {
        res.status(400).json({ error: "Error al editar las reviews", message: error });
    }
}

module.exports = { createWebReview, getReviewsOfWeb, putWebReview, getAllWebReviews }