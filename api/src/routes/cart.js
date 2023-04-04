const Router = require("express")
const router = Router()
const {getCart, putCart, deleteItemsCart, throwItemsCart} = require("../handlers/cart.handlers")

router.get("/:id", getCart);
router.post("/restQuantity",deleteItemsCart);
router.post("/addQuantity", putCart);
router.delete("/:gameId", throwItemsCart)




module.exports = router 



