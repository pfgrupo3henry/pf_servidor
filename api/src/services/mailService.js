const nodemailer = require("nodemailer")
var Mailgen = require('mailgen');
const randomstring = require('randomstring');
const { Order, Videogame, OrdersDetail, Genre, Platform } = require("../db");
const {
  GMAIL_USER, GMAIL_PASS
} = process.env;

function generateCode(num) {
  const code = randomstring.generate({
    length: 12,
    charset: 'alphanumeric',
    capitalization: 'uppercase',
    readable: true,
    seed: num.toString()
  });
  return code;
}


 async function generateSaleTemplate(orderId) {
   let hashCode = ""

  const order = await Order.findByPk(orderId, {include: [
    {
      model: Videogame,
      include: [
        {
            model: Genre,
            attributes: ['name'],
            through: {
                attributes: [],
            },
        },
        {
            model: Platform,
            attributes: ['name'],
            through: {
                attributes: [],
            }
        },
    ],
      through: {
        model: OrdersDetail,
        attributes: ["quantity", "subtotal"],
      },
    },
  ]})
  
  let itemsBody = order.videogames.map(el => {
    return {
      Cantidad: el.OrdersDetail.quantity,
      Juego: el.name,
      xUnidad: "$" + el.price,
      Valor: "$" + el.OrdersDetail.subtotal
    }
  })

  itemsBody[itemsBody.length] = {
    Cantidad: '',
    Juego: '',
    xUnidad: '',
    Valor: "Total: $" + order.totalAmount.split(".")[0]}//el monto total trae un punto para indicar los centavos, aca se los sacamos debido a la devaluacion que sufrimos en la argentina ahr 
    
    let itemsBodyCode = order.videogames.map(el => {
      hashCode = generateCode(el.id)
      return {
        Nombre: el.name, 
        Plataforma: el.platforms[0].name,
        Codigo: hashCode
      }
    })

    return {itemsBody: itemsBody, code: itemsBodyCode}
}

async function mailer(to, subject, body){

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

var emailBody = mailGenerator.generate({body});
var emailText = mailGenerator.generatePlaintext({body});


     let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: `${GMAIL_USER}`, // generated ethereal user
          pass: `${GMAIL_PASS}`, // generated ethereal password
        },
      });


    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"HenryGameStore" <henrygamestore08@gmail.com>', // sender address
        to: `${to}`, // list of receivers
        subject: subject, // Subject line
        text: emailText, // plain text body
        html: emailBody, // html body
      });

      console.log(`(^-^) Email sent to ${to}`, info);
    }


 module.exports = {mailer, generateSaleTemplate}


