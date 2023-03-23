const Router = require('express');
const { createVideogameHandler, videogamesHandlers, videogameHandler, modifyVideogameHandler } = require('../handlers/videogames.handlers');
const router = Router();

router.get('/', videogamesHandlers);
router.get('/:id', videogameHandler);
router.post('/create', createVideogameHandler);
router.put('/modify', modifyVideogameHandler);