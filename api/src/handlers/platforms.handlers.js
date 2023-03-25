const {getGameByPlatform} = require('../controllers/platforms.controllers');

const platformsHandlers = async (req, res) => {
    const { name } = req.body;
    try { 
        const platform = await getGameByPlatform(name);
        res.status(201).json(platform);
    } catch (error) {
        res.status(400).json({ error: "Error al traer las plataformas" });
    }
};

module.exports = {platformsHandlers}