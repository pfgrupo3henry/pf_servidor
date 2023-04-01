const nodemailer = require("nodemailer")
var Mailgen = require('mailgen');

/* // Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Mailgen',
        link: 'https://mailgen.js/'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});

var email = {
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
};


var emailBody = mailGenerator.generate(email);
var emailText = mailGenerator.generatePlaintext(email);
var emailToSend = {
    from: 'pfgrupo3henry@gmail.com',
    to: 'tazza.personal@gmail.com', // <-- Direccion del destinatario
    subject: 'Confirm your email',
    html: emailBody,
    text: emailText
};


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pfgrupo3henry@gmail.com', // Tu email
        pass: 'henrygamestore' // Tu contraseña
    }
});

// Enviar el correo electrónico
transporter.sendMail(emailToSend, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
 */
 

// async..await is not allowed in global scope, must use a wrapper


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "noemie2@ethereal.email", // generated ethereal user
      pass: 'qPKtU3KpKNQb1Q7HXm', // generated ethereal password
    },
  });


transporter.verify().then(() => console.log("ready for send emails"))
