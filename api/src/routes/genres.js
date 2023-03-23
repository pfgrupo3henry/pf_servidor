const Router = require('express');
const router = Router();
const {genresHandlers} = require('../handlers/genres.handlers');

router.get('/', genresHandlers);