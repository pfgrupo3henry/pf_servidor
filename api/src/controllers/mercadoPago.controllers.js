const mercadopago = require("mercadopago");
const { User, Review, Payment, Order } = require('../db');
const { Videogame } = require('../models/Videogame');
const { query } = require("express");
const { generateOrder, approveOrder, rejectOrder } = require("./orders.controllers");
const product = Videogame;
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});

const getAllPayment = async (req,res) => {
try {
const payments = await Payment.findAll()
res.status(200).json(payments)
}
catch(e) {res.status(500).json({message: e})}
};


const paymentPostController = async (req, res) => {
const prod = req.body

  const {totalPrice, userId} = req.body
 
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
      notification_url: `https://pfservidor-production.up.railway.app/payment/${userId}`,
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
  try{
  const userId = req.params.id
  const {query} = req
  console.log(query)
  const payment_id = req.query["data.id"]
  const payment_switch = req.query.type

  if(payment_switch === "payment") {
    const payment = await mercadopago.payment.findById(payment_id);
    console.log(payment)
    /* const paymentModel = await Payment.create({info : payment.body}) */
    
    if(payment.response.status === "approved"){
      let order_info = await generateOrder(userId)
      order_info = await approveOrder(order_info.id)
    /* order_info.paymentId = paymentModel.id */
  
    
    res.status(200).send({Order: order_info})
  }
  else if (payment.response.status === "rejected") {
    let order_info = await generateOrder(userId)
    order_info = await rejectOrder(order_info.id)
    
    res.status(200).send({Order: order_info})
  }

  }
  // const payment_id = req.query.payment_id;
  // const payment_status = req.query.status;
  // const external_reference = req.query.external_reference;

  
var merchantOrder;  

/* switch (topic) {
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
} */
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
catch (e) {res.status(500).send({message: e})}
}


module.exports = {paymentPostController, getPaymentInfo, getAllPayment};