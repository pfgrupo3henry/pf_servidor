const {User} = require('../db');
const {emailToSend} = require('../services/mailService');
/* const {JWT_SECRET} = process.env */

const sendEmail = async(token) =>  {
   try{

    if(!token) {
        throw new Error('User not authorized');
    }
  
    else if(!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined')
    }

    const decoded = jwt.verify(token,JWT_SECRET)

    const user = await User.findByPk(decoded.id)
    console.log(user)

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "pfgrupo3henry@gmail.com", 
          pass: "nhdqnfcuiffjyavg", 
        },
      });
      
      
      let info = await transporter.sendMail(emailToSend(user.firstname, user.lastname, user.email), function(error, info) {
          if (error) {
              console.log(error);
          } else {
              console.log('Email sent: ' + info.response);
          }
      });
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
         
        return {success: "email sent!"}
    }
    catch(e) {return {message: "Error Sending Email"}}
};


module.exports = {sendEmail}
     