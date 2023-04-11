const { Cart, Order, Videogame, OrdersDetail , Payment} = require('../db');

async function generateOrder(userId) {

const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).send({ error: 'Carrito no encontrado' });
    }
    
    if (!cart.products.length) {

      return res.status(400).send({ error: 'No products in cart' });

    }
    
    const order = await Order.create({
      userId: userId,
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

    return order 

  }


async function approveOrder(orderId) {
  const order = await Order.findOne({ 
    where: { id: orderId },
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
  // console.log(order);

  if (!order) {
    throw new Error ('No se encontró la orden');
  };

  let allVideogames= await Videogame.findAll();
 
  const videogamesOrder= order.videogames.map(v => ({
    id: v.id,
    quantity: v.OrdersDetail.quantity
  }));

  videogamesOrder.forEach(async (v) => {
    const product= allVideogames.find( p=> p.dataValues.id === v.id );
    if (product.dataValues.stock < 1) throw new Error (`Without Stock of: "${product.dataValues.name}" videogame`);
    product.dataValues.stock -= v.quantity; 
    const findVideogame= await Videogame.findByPk(product.dataValues.id);
    await findVideogame.update({
      stock: product.dataValues.stock
    });
  });
  


  order.status = 'Completed Pay';

  await order.save();

  return order;

}


async function rejectOrder(orderId) {

const order = await Order.findOne({ where: { id: orderId } });

if (!order) {
  return res.status(404).json({ message: 'No se encontró la orden' });
}

order.status = 'Rejected Pay';

await order.save();

return order
}

module.exports = {generateOrder, approveOrder, rejectOrder}