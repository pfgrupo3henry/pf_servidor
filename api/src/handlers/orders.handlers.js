const { Cart, Order, Videogame, OrdersDetail } = require('../db');

const createOrder = async (req, res) => {
  
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).send({ error: 'Carrito no encontrado' });
    }
    
    if (!cart.products.length) {

      return res.status(400).send({ error: 'No products in cart' });

    }
    
    const order = await Order.create({
      userId,
      cartId: cart.id
    });

    for (const product of cart.products) {
      const videogame = await Videogame.findByPk(product.id);
      const subtotal = product.quantity * videogame.price;
      await order.addVideogame(videogame, { through: { quantity: product.quantity, subtotal: subtotal }});
    }
  
    const orderVideogames = await order.getVideogames();

    let totalAmount = 0;
    for (const videogame of orderVideogames) {
      totalAmount += videogame.price * videogame.OrdersDetail.quantity;
    }

    await order.update({ totalAmount });

    res.status(201).send({ order });
    
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal server error' });
  }
};

const getOrders = async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).send({ error: 'Carrito no encontrado' });
    }

    const orders = await Order.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: Videogame,
          through: {
            model: OrdersDetail,
            attributes: ['quantity', 'subtotal']
          }
        }
      ]
    });

    res.status(200).send({ orders });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal server error' });
  }
};




module.exports = { createOrder, getOrders };



