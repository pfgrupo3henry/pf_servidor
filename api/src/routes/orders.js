const Router = require('express');
const router = Router();
const {createOrder, getOrders, getAllOrders, succesOrder, canceledOrder, pendingOrder} = require("../handlers/orders.handlers")


router.post("/", createOrder);
router.get("/", getOrders);

router.get("/allOrders", getAllOrders );

//para recuperar una orden que fue cancelada devolviendole el valor original que cuando fue creada
router.put("/pending", pendingOrder)
//cuando la orden fue pagada
router.put("/succes", succesOrder)
//cuando la orden fue ejecutada y despues cancelada por el usuario
router.put("/candeled", canceledOrder)




module.exports = router