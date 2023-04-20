const Router = require('express');
const { getVideogames, getVideogameById, modifyVideogameHandler, modifyGameWithImg } = require('../handlers/videogames.handlers');
const { createVideogameDb, createVideogame } = require('../controllers/videogames.controllers');
const router = Router();

router.get('/', getVideogames);
router.get('/:id', getVideogameById);
router.put('/modify/img', modifyGameWithImg);
router.put('/modify', modifyVideogameHandler);
router.post("/", createVideogame);
router.post("/createDb", createVideogameDb);

module.exports = router