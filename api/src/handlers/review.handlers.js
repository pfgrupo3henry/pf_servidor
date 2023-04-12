const {Review} = require('../db');
const { editReview } = require('../controllers/review.controller');

const createReview = async (req, res) => {
    const {videogameId} = req.body
    console.log(videogameId)
    try { 
        await Review.create(req.body);
        
        const allReviews = await Review.findAll({ where: { videogameId: videogameId } })
        res.status(201).json(allReviews);
    } catch (error) {
        res.status(400).json({ error: "Error al crear la Review" });
    }
};



const getReviewsOfGame = async (req, res) => {

    const { gameId} = req.params;
    try { 
        if(gameId){
        const review = await Review.findAll({ where: { videogameId: gameId } });
        
        if(!review) {return new Error("no existen reviews de este juego")}
        res.status(201).json(review);
        }
        else { const reviews = await Review.findAll();
            if(!reviews) {return new Error("no existen reviews de ningún juego")}
            res.status(201).json(reviews)}
    } catch (error) {
        res.status(400).json({ error: "Error al traer las reviews", message: error });
    }
};

const putReview = async (req, res) => {
    const {userId} = req.params;
    const { videogameId, comment, rate, status } = req.body;
    try {
        const editedProduct = await editReview(userId, videogameId, comment, rate, status);
        res.status(200).json(editedProduct);
    } catch (error) {
        res.status(400).json({ error: "Error al editar las reviews", message: error });
    }
}

module.exports = {createReview, getReviewsOfGame, putReview}