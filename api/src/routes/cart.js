const Router = require("express")
const router = Router()
const {getCart} = require("../handlers/cart.handlers")

router.get("/", getCart);




module.exports = router



