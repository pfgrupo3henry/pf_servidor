const Router = require('express');
const router = Router();
const {createPlatforms} = require('../controllers/platforms.controllers');


// router.get('/', platformsHandlers);

router.post("/platforms", createPlatforms);