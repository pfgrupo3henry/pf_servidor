const Router = require("express")
const router = Router()
const {getCart, putCart, deleteItemsCart} = require("../handlers/cart.handlers")

router.get("/:id", getCart);
router.put("/", putCart);
router.delete("/", deleteItemsCart)




module.exports = router



