const Router = require('express');
const router = Router();
const {platformsHandlers} = require('../handlers/platforms.handlers');

router.get('/', platformsHandlers);