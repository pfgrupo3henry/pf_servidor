const Router = require('express');
const router = Router();
const {createOrder, getOrders} = require("../handlers/orders.handlers")


router.post("/", createOrder);
router.get("/", getOrders);



module.exports = router