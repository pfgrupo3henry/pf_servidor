const mercadopago = require("mercadopago");
const { User, Review, Payment } = require('../db');
const { Videogame } = require('../models/Videogame');
const { query } = require("express");
const product = Videogame;
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});




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
        failure: '',
        pending: '',
      },
      notification_url: 'https://00f1-186-138-114-149.sa.ngrok.io/payment',
      statement_descriptor: "Henry Game Store",
      // para que no se puedan hacer pagos pendientes (rapipago, etc)
      binary_mode: true,
    };

     // 1. Crear la preferencia de pago
     const preferenceResponse = await mercadopago.preferences.create(preference);

     // Obtener el ID de la preferencia de pago
     const preferenceId = preferenceResponse.body.id;
     
     // 2. Redirigir al usuario a la URL de pago de Mercado Pago
       await Payment.create({preferenceId: preferenceId, userId:userId })
     
      res.status(200).send({ response: preferenceResponse, preferenceId: preferenceId, userId: userId});
      
  } catch (error) {
    res.status(400).json({error: error.message})
  }
};

// para recibir la info del pago
const getPaymentInfo = async (req, res, next) => {
  const userId = req.params.id
  // const payment_id = req.query.payment_id;
  // const payment_status = req.query.status;
  // const external_reference = req.query.external_reference;
try{
  const merchantOrder = null;
  const payment1 = await Payment.findOne( { where: { userId: userId } })
  const paymentResponse = await mercadopago.payment.get(payment1.preferenceId);

  res.status(200).send({  paymentResponse: payment1, paymentResponse: paymentResponse })
}
catch(e){ res.status(400).json({error: e})}
/* switch (topic) {
  case "payment":
    // mercadopago.payment.get(req.query.id).then((payment) => {
    //   mercadopago.merchant_orders.get(payment.order.id).then((order) => {
    //     merchant_order = order;
    //     checkPayment();
    //   })
    const paymentId = query.id
    const payment = await mercadopago.payment.findById(paymentId);
    merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id)
    .catch((error) => {
        console.log(error);
      });
    break;
    console.log(payment);
  case "merchant_order":
    // mercadopago.merchant_orders.get(req.query.id).then((order) => {
    //   merchant_order = order;
    //   checkPayment();
    // })
    const orderId = query.id;
    merchantOrder = await mercadopago.merchant_orders.findById(orderId)
    .catch((error) => {
      console.log(error);
    });
    break;
}
console.log(merchantOrder.body.payments);

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
}


module.exports = {paymentPostController, getPaymentInfo};