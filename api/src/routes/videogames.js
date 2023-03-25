const Router = require('express');
const { createVideogame } = require('../controllers/videogames.controllers');
const router = Router();
const {Videogame, Genre, Platform} = require("../db");
const {videogames} = require('../utils/data-videogames');

//router.get('/', videogamesHandlers);
//router.get('/:id', videogameHandler);
//router.put('/modify', modifyVideogameHandler);
router.post("/", createVideogame);

module.exports = router