const Router = require("express")
const router = Router()
const {getCart, putCart, deleteItemsCart} = require("../handlers/cart.handlers")

router.get("/:id", getCart);
router.put("/:id", putCart);
router.delete("/:id", deleteItemsCart)




module.exports = router



