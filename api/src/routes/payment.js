const Router = require("express");
const { paymentPostController, getPaymentInfo, getAllPayment } = require('../controllers/mercadoPago.controllers');

const router = Router();

/* router.get("/allPayment", getAllPayment); */
router.post("/mercadopago", paymentPostController);
router.post("/:id", getPaymentInfo);


module.exports = router;