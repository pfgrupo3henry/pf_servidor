const Router = require('express');
const router = Router();
const {createGenres, getGenres} = require('../controllers/genres.controllers');
const nodemailer = require("nodemailer");


router.post("/", async(req,res)=> {

     const {email} = req.body

     let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "pfgrupo3henry@gmail.com", // generated ethereal user
          pass: "henrygamestore", // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"HenryGameStore" <pfgrupo3henry@gmail.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "Hello aguante el Barca✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
       
      res.send("email sent!")
});



module.exports = router