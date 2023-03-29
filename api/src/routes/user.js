const Router = require("express")
const router = Router()
const {postUser} = require("../handlers/user.handlers")

router.post("/", postUser);




module.exports = router