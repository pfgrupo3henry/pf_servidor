const Router = require('express');
const { createVideogameDb, createVideogame, getVideogames, getVideogameById } = require('../controllers/videogames.controllers');
const router = Router();
const {Videogame, Genre, Platform} = require("../db");
const {videogames} = require('../utils/data-videogames');

router.get('/', getVideogames);
router.get('/:id', getVideogameById);
//router.put('/modify', modifyVideogameHandler);
router.post("/", createVideogame);
router.post("/createDb", createVideogameDb);

module.exports = router