const nodemailer = require("nodemailer")
var Mailgen = require('mailgen');



async function mailer(to, subject, body){
// Configure mailgen by setting a theme and your product info

var mailGenerator = new Mailgen({
    theme: 'cerberus',
    product: {
        // Appears in header & footer of e-mails
        name: 'HenryGameStore',
        link: 'https://pf-front-y72g-git-develop-pfgrupo3henry.vercel.app/home'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});

/* var email = {
    body: {
        name: 'John',
        intro: 'Your email has been registered!',
        action: {
            instructions: 'Click the button below to confirm your email:',
            button: {
                color: '#33b5e5',
                text: 'Confirm your account',
                link: 'https://example.com/confirm'
            }
        },
        outro: 'Thank you for registering!'
    }
}; */




var emailBody = mailGenerator.generate({body});
var emailText = mailGenerator.generatePlaintext({body});
/* var emailToSend = {
    from: 'pfgrupo3henry@gmail.com',
    to: 'tazza.personal@gmail.com', // <-- Direccion del destinatario
    subject: 'Confirm your email',
    html: emailBody,
    text: emailText
}; */


     let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "pfgrupo3henry@gmail.com", // generated ethereal user
          pass: "nhdqnfcuiffjyavg", // generated ethereal password
        },
      });


    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"HenryGameStore" <pfgrupo3henry@gmail.com>', // sender address
        to: `${to}`, // list of receivers
        subject: subject, // Subject line
        text: emailText, // plain text body
        html: emailBody, // html body
      });

      console.log(`(^-^) Email sent to ${to}`, info);
    }


 module.exports = {mailer}

// async..await is not allowed in global scope, must use a wrapper


  // create reusable transporter object using the default SMTP transport
  /* let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "noemie2@ethereal.email", // generated ethereal user
      pass: 'qPKtU3KpKNQb1Q7HXm', // generated ethereal password
    },
  }); */

