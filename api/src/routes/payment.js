const Router = require("express");
const { paymentPostController, getPaymentInfo } = require('../controllers/mercadoPago.controllers');

const router = Router();

router.post("/mercadopago", paymentPostController);
router.get("/", getPaymentInfo);

module.exports = router;