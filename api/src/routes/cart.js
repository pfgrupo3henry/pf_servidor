const Router = require("express")
const router = Router()
const {getCart, putCart, deleteItemsCart, throwItemsCart, emptyCart} = require("../handlers/cart.handlers")

//GET
router.get("/:id", getCart);
//PUT
router.put("/", emptyCart)
//POST
router.post("/restQuantity",deleteItemsCart);
router.post("/addQuantity", putCart);
//DELETE
router.delete("/:gameId", throwItemsCart)



module.exports = router 




