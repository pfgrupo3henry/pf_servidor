const {User} = require('../db');
const {emailToSend} = require('../services/mailService');
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const {JWT_SECRET} = process.env

const sendEmail = async(token) =>  {
   try{

    if(!token) {
        throw new Error('User not authorized');
    }
  
    else if(!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined')
    }
    
    const decoded = jwt.verify(token,JWT_SECRET);

    const user = await User.findByPk(decoded.id)

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "pfgrupo3henry@gmail.com", 
          pass: "nhdqnfcuiffjyavg", 
        },
      });
      
      let email = emailToSend(user.firstname, user.lastname, user.email)
      
      let info = await new Promise((resolve, reject) => {
        transporter.sendMail(email, function(error, info) {
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
         
        return {success: "email sent!"}
    }
    catch(e) {return {message: "Error Sending Email"}}
};


module.exports = {sendEmail}
     