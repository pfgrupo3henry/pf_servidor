const Router = require('express');
const router = Router();
const {createGenres} = require('../controllers/genres.controllers');

// router.get('/', genresHandlers);
router.post("/genres", createGenres);