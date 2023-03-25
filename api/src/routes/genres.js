const Router = require('express');
const router = Router();
const {createGenres, getGenres} = require('../controllers/genres.controllers');

router.get('/', getGenres);
router.post("/", createGenres);



module.exports = router
