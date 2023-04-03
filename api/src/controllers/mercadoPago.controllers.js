const mercadopago = require("mercadopago");
const { Videogame } = require('../models/Videogame');
const { query } = require("express");
const product = Videogame;
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});

const paymentPostController = async (req, res) => {

//   const token = req.body.token;
//   const { email, description, amount } = req.body;

//   // Inicializar Mercado Pago con sus credenciales
//   mercadopago.configure({
//     access_token: process.env.ACCESS_TOKEN,
// });

//   // Crear el objeto de pago
//   const payment_data = {
//     transaction_amount: parseFloat(amount),
//     token: token,
//     description: description,
//     payer: {
//       email: email
//     }
//   };

//   mercadopago.payment.save(req.body)
//   .then(function(response) {
//     const { status, status_detail, id } = response.body;
//     res.status(response.status).json({ status, status_detail, id });
//   })
//   .catch(function(error) {
//     console.error(error);
//   });

//   try {
//     // Enviar solicitud de pago a la API de Mercado Pago
//     const payment = await mercadopago.payment.save(payment_data);

//     // Redirigir al usuario a la página de pago de Mercado Pago
//     const url = payment.response.init_point;
//     return res.redirect(url);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error al procesar el pago' });
//   }

  const prod = req.body;
  const totalPrice = req.body.totalPrice;

  try {
    const preference = {
      items: [
        { 
          id: prod.id,
          title: prod.name,
          currency_id: 'ARS',
          category_id: 'art',
          unit_price: totalPrice,
          picture_url: prod.img,
          description: prod.description,
        }
      ],
      back_urls: {
        //rutas de acuerdo a como haya salido la transacion
        success: 'https://pf-front-y72g-git-develop-pfgrupo3henry.vercel.app/home',
        failure: '',
        pending: '',
      },
      notification_url: 'https://00f1-186-138-114-149.sa.ngrok.io/payment',
      statement_descriptor: "Henry Game Store",
      auto_return: 'approved',
      // para que no se puedan hacer pagos pendientes (rapipago, etc)
      binary_mode: true,
    };

    return await mercadopago.preferences.create(preference).then((response) => {
      res.status(200).send({ response: response });
    });
  } catch (error) {
    res.status(400).json({error: error.message})
  }
};

// para recibir la info del pago
const getPaymentInfo = async (req, res, next) => {
  // const payment_id = req.query.payment_id;
  // const payment_status = req.query.status;
  // const external_reference = req.query.external_reference;

  const merchantOrder = null;

switch (topic) {
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
  });
}


module.exports = {paymentPostController, getPaymentInfo};