const Router = require('express');
const router = Router();
const {createPlatforms, getPlatforms} = require('../controllers/platforms.controllers');


router.get('/', getPlatforms);

router.post("/", createPlatforms);


module.exports = router

