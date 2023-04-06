const Router = require('express');
const router = Router();
const {putFavorites, getFavorites, deleteFavorites} = require('../handlers/favorites.handlers');

router.get('/:id', getFavorites);
router.post("/addFavorite", putFavorites);
router.post("/restFavorite", deleteFavorites);



module.exports = router