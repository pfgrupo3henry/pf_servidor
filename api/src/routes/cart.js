const Router = require("express")
const router = Router()
const {getCart, putCart} = require("../handlers/cart.handlers")

router.get("/", getCart);
router.put("/", putCart)




module.exports = router



