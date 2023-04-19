const axios = require("axios")
const mercadopago = require("mercadopago");
const { User, Review, Payment, Order, Cart, Videogame, OrdersDetail } = require('../db');
const { mailer, generateSaleTemplate } = require("../services/mailService");
const { generateOrder, approveOrder, rejectOrder } = require("./orders.controllers");

mercadopago.configure({
  access_token: 'process.env.ACCESS_TOKEN',
});

const getAllPayment = async (req,res) => {
try {
const payments = await Payment.findAll()
res.status(200).json(payments)
}
catch(e) {res.status(500).json({message: e})}
};


const paymentPostController = async (req, res) => {
  let prod = req.body

  const {totalPrice, userId} = req.body
  try {
 
  let cart = await Cart.findOne({where: {userId: userId}})
  const productIds = cart.products.map((product) => product.id);
  const videogames = await Videogame.findAll({ where: { id: productIds } });
 
  //los objetos traidos por cart trae las id de los juegos por lo tanto los buscamos para tener el precio y el nombre
  const newProducts = cart.products.map((product) => {

   const videogame = videogames.find((v) => v.id === product.id);
   return {

     ...product,
     ...videogame.toJSON(),
     quantity: product.quantity,
   };
   });

  prod = newProducts

    const preference = {
      items: [{
        id: prod.id,
        title: prod.name,
        quantity: 1,
        currency_id: "ARS",
        category_id: "art",
        unit_price: totalPrice,
        picture_url: prod.img,
        description: prod.description
      }],
      back_urls: {
        //rutas de acuerdo a como haya salido la transacion
        success: 'https://pf-front-y72g-git-develop-pfgrupo3henry.vercel.app/home',
        failure: 'https://pf-front-y72g-git-develop-pfgrupo3henry.vercel.app/home',
        pending: 'https://pf-front-y72g-git-develop-pfgrupo3henry.vercel.app/home',
      },
      auto_return: "approved",
      notification_url: `https://pfservidor-production.up.railway.app/payment/${userId}`,
      statement_descriptor: "Henry Game Store",
      // para que no se puedan hacer pagos pendientes (rapipago, etc)
      
    };
    
    let fee_title = ""
    for (let i = 0; i < prod.length; i++) {
      fee_title = prod[i].name + ", " + fee_title
      if(i === prod.length - 1) {
        //combinamos todos los nombres de los juegos para colocarlo en el primer objeto de items ya que es el unico que aparece en el comprobante
        fee_title = fee_title.slice(0, -2) + "." //le quitamos la coma que quedo al final y lo reemplazamos por un punto final 
        preference.items[0].title = fee_title
      }
    }
     // Creamos la preferencia de pago
     return await mercadopago.preferences.create(preference).then((response) => {

      res.status(200).send({ response: response });
  })
  } catch (error) {
    res.status(400).json({error: error.message})
  }
};

async function sendMail(customerId, orderId) {
  // Send event to customer
  try {
    const customer = await User.findByPk(customerId);
    const to = customer.email;
    const subject = `HenryGameStore - Compra realizada con éxito. Pedido N° ${orderId}`;

    const itemsBody = await generateSaleTemplate(orderId)

    const body = {
        name: customer.firstname,  
        greeting: "Hola",
        signature: "Saludos cordiales",
        intro: ['¡Gracias por tu compra!', 'Tu compra ha sido exitosa. Acá está la lista de tus productos:'],
        table: [{
          data: itemsBody.itemsBody,
          columns: {
            // Optionally, customize the column widths
            customWidth: {
                Juego: '40%',
                priceTotal: '15%'
            },
            // Optionally, change column text alignment
            customAlignment: {
                Valor: 'right'
            }
        }},
        {
          data: itemsBody.code,
          columns: {
            // Optionally, change column text alignment
            customAlignment: {
                Nombre: 'left',
                Plataforma: 'middle',
                Codigo: 'right'
            }
        }
        }],
        outro: ["Acceda con sus datos al sitio para ver el detalle de su pedido.", "Esperamos que disfrutes de tus productos y gracias por confiar en nosotros."]
    }
    await mailer(to, subject, body);
  } catch (error) {
     console.log(error);
  }
}

// para recibir la info del pago
const getPaymentInfo = async (req, res, next) => {
  try{
  const userId = req.params.id
  const payment_id = req.query["data.id"]
  const payment_switch = req.query.type

  if(payment_switch === "payment") {
    const payment = await mercadopago.payment.findById(payment_id);
    /* const paymentModel = await Payment.create({info : payment.body}) */
    
    if(payment.response.status === "approved"){
      try{
      let order_info = await generateOrder(userId)
      order_info = await approveOrder(order_info.id)
    /* order_info.paymentId = paymentModel.id */
      sendMail(userId, order_info.id)

      res.status(200).send({Order: order_info})
      }
      catch (error) {res.status(500).send({message: error.message})}
    }
    else if (payment.response.status === "rejected") {
    try{
      let order_info = await generateOrder(userId)
    order_info = await rejectOrder(order_info.id)
    
    res.status(200).send({Order: order_info})

    }
    catch (error) {res.status(500).send({message: error.message})}
    }

  }
  // const payment_id = req.query.payment_id;
  // const payment_status = req.query.status;
  // const external_reference = req.query.external_reference;


  res.status(200).send()
}
catch (error) {res.status(500).send({message: error.message})}
}


module.exports = {paymentPostController, getPaymentInfo, getAllPayment};
