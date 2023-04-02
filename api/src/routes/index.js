const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const videogamesRouter = require('./videogames');
const platformsRouter = require('./platforms');
const genresRouter = require('./genres');
const cartRouter = require('./cart');
const usersRouter = require('./users');
const favoritesRouter = require('./favorites');
const paymentRouter = require('./payment');

const router = Router();
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/videogames', videogamesRouter);
router.use('/platforms', platformsRouter);
router.use('/genres', genresRouter);
router.use('/cart', cartRouter);
router.use('/user', usersRouter);
router.use('/favorites', favoritesRouter);
router.use('/payment', paymentRouter);
router.use('/notification', (req, res) => {
    console.log("Notificar");
    const { body, query } = req;
    console.log({ body, query } );
    res.send();
});

module.exports = router;
