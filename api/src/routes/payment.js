const Router = require("express");
const { paymentPostController, getPaymentInfo, getAllPayment } = require('../controllers/mercadoPago.controllers');

const router = Router();

/* router.get("/allPayment", getAllPayment); */
router.post("/mercadopago", paymentPostController);
router.get("/:id", getPaymentInfo);


module.exports = router;