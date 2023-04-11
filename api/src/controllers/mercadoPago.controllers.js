const mercadopago = require("mercadopago");
const { User, Review, Payment, Order } = require('../db');
const { Videogame } = require('../models/Videogame');
const { query } = require("express");
const product = Videogame;
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});

const succesPayment = async (req,res) => {



};


const paymentPostController = async (req, res) => {

 
  const prod = req.body;
  const totalPrice = req.body.totalPrice;
  const userId = req.body.userId;
 
  try {
    const preference = {
      items: [
        { 
          id: prod.id,
          title: prod.name,
          quantity: 1,
          currency_id: 'ARS',
          category_id: 'art',
          unit_price: totalPrice,
          picture_url: prod.img,
          description: prod.description,
        }
      ],
      back_urls: {
        //rutas de acuerdo a como haya salido la transacion
        success: 'http://localhost:3000/home',
        failure: 'http://localhost:3000/home',
        pending: '',
      },
      auto_return: "approved",
      notification_url: 'https://405f-2800-810-451-668-48ce-17a0-ccde-af9c.ngrok-free.app/payment',
      statement_descriptor: "Henry Game Store",
      // para que no se puedan hacer pagos pendientes (rapipago, etc)
      binary_mode: true,
    };

     // 1. Crear la preferencia de pago
     return await mercadopago.preferences.create(preference).then((response) => {

      res.status(200).send({ response: response });
  })
  } catch (error) {
    res.status(400).json({error: error.message})
  }
};

// para recibir la info del pago
const getPaymentInfo = async (req, res, next) => {
  const {query} = req
  let hola = req.query[data.id]
  let pay = req.query.type
  console.log("holaaaaaaaaaaa", hola, pay)
  const topic = query.topic
  // const payment_id = req.query.payment_id;
  // const payment_status = req.query.status;
  // const external_reference = req.query.external_reference;

  
var merchantOrder;  

switch (topic) {
  case "payment":
    // mercadopago.payment.get(req.query.id).then((payment) => {
    //   mercadopago.merchant_orders.get(payment.order.id).then((order) => {
    //     merchant_order = order;
    //     checkPayment();
    //   })
    const paymentId = query.id
    const payment = await mercadopago.payment.findById(paymentId);
    console.log("ESTATUS",payment.response.status)
    merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id)
    await Payment.create({info: payment})
    
    break;
  case "merchant_order":
    // mercadopago.merchant_orders.get(req.query.id).then((order) => {
    //   merchant_order = order;
    //   checkPayment();
    // })
    const orderId = query.id;
    merchantOrder = await mercadopago.merchant_orders.findById(orderId)
    console.log(" este merchantOrder", merchantOrder)
    
  break;
}
/* console.log(merchantOrder.body.payments);

  const paidAmount = 0;
  merchantOrder.body.payments.forEach(payment => {
    if (payment.status === 'approved') {
      paidAmount += payment.transaction_amount;
    } else if (paidAmount >= merchantOrder.body.total_amount) {
      console.log("Pago exitoso");
    } else {
    console.log("No se pudo realizar el pago");
  }
  }); */

  res.status(200).send()
}


module.exports = {paymentPostController, getPaymentInfo};