const Router = require('express');
const router = Router();
const {authMiddleware} = require("../middlewares/authMiddleware")
const {postEmail} = require('../handlers/mail.handlers');
const nodemailer = require("nodemailer")


/* router.post("/", postEmail); */



module.exports = router