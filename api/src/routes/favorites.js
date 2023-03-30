const Router = require('express');
const router = Router();
const {putFavorites, getFavorites} = require('../handlers/favorites.handlers');

router.get('/', getFavorites);
router.put("/", putFavorites);



module.exports = router