const {getGameByGenre} = require('../controllers/platforms.controllers');

const genresHandlers = async (req, res) => {
    const { name } = req.body;
    try { 
        const genre = await getGameByGenre(name);
        res.status(201).json(genre);
    } catch (error) {
        res.status(400).json({ error: "Error al traer los generos" });
    }
};

module.exports = {genresHandlers}