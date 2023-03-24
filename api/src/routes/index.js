const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const videogames = require('./videogames');
const platforms = require('./platforms');
const genres = require('./genres');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
 router.use('/videogames', videogames);
// router.use('./platforms', platforms);
// router.use('./genres', genres);

module.exports = router;
