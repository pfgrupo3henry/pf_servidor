const {Review} = require('../db');

const createReview = async (req, res) => {
    try { 
        const review = await Review.create(req.body);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: "Error al crear la Review" });
    }
};



const getReviewsOfGame = async (req, res) => {
    const { gameId} = req.params;
    try { 
        const review = await Review.findAll({ where: { videogameId: gameId } });
        
        if(!review) {return new Error("no existen reviews de este juego")}
        
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: "Error al traer las reviews", message: error });
    }
};

module.exports = {createReview, getReviewsOfGame}