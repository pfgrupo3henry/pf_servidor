const { Cart, Order, Videogame, OrdersDetail, User } = require('../db');

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

    res.status(201).send({ order });
    
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Error en la creacion de la orden' });
  }
};

const getOrders = async (req, res) => {
  
  /* const { userId } = req.body; */

  let hardcodeo = {
    orders: [
      {
        id: 5,
        userId: 4,
        cartId: 5,
        totalAmount: "50400.00",
        status: "Pending Pay",
        paymentId: null,
        createdAt: "2023-04-09T16:24:35.556Z",
        updatedAt: "2023-04-09T16:24:35.573Z",
        videogames: [
          {
            name: "A Way Out Retro",
            id: 2,
            description: "Este título de acción y aventura se enfoca en la cooperación, con una trama centrada en las hazañas de dos prisioneros en fuga, Leo y Vincent, obligados a trabajar juntos para evitar a la policía y otros criminales. Para lograrlo deberán superar persecuciones en coche, pasajes sigilosos y combates cuerpo a cuerpo.",
            img: [
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454318/Ps5/A%20Way%20Out%20PS5%20Retro/a-way-out-ps5-retro-330x404_dhgoda.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454315/Ps5/A%20Way%20Out%20PS5%20Retro/a-way-out_7_gopu5m.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454315/Ps5/A%20Way%20Out%20PS5%20Retro/a-way-out_6-330x186_yc8yps.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454317/Ps5/A%20Way%20Out%20PS5%20Retro/a-way-out_5-330x186_suc2wc.jpg"
            ],
            price: "10080",
            status: "Active",
            createdAt: "2023-04-03T00:47:11.694Z",
            updatedAt: "2023-04-03T00:47:11.694Z",
            OrdersDetail: {
              quantity: 3,
              subtotal: 30240
            }
          },
          {
            name: "Alien Isolation PS5 Retro",
            "id": 5,
            description: "En una atmósfera que incluye temor, peligro y un alienígena impredecible, los jugadores encarnan el papel de Amanda, quien lucha por sobrevivir y cumplir su objetivo de saber cuál es la verdad detrás de la desaparición de su madre.",
            img: [
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454308/Ps5/Alien%20Isolation%20PS5%20Retro/alien-isolation_wgrtt3.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454320/Ps5/Alien%20Isolation%20PS5%20Retro/alien-isolation_4-330x185_ncfjpj.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454317/Ps5/Alien%20Isolation%20PS5%20Retro/alien-isolation_2-330x185_g8pnms.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454316/Ps5/Alien%20Isolation%20PS5%20Retro/alien-isolation_5-330x185_f6himr.jpg"
            ],
            price: "10080",
            status: "Active",
            createdAt: "2023-04-03T00:47:11.695Z",
            updatedAt: "2023-04-03T00:47:11.695Z",
            OrdersDetail: {
              quantity: 2,
              subtotal: 20160
            }
          }
        ]
      },
      {
        id: 6,
        userId: 5,
        cartId: 6,
        totalAmount: "54920.00",
        status: "Pending Pay",
        paymentId: null,
        createdAt: "2023-04-09T16:29:39.660Z",
        updatedAt: "2023-04-09T16:29:39.697Z",
        videogames: [
          {
            name: "A Way Out Retro",
            id: 2,
            description: "Este título de acción y aventura se enfoca en la cooperación, con una trama centrada en las hazañas de dos prisioneros en fuga, Leo y Vincent, obligados a trabajar juntos para evitar a la policía y otros criminales. Para lograrlo deberán superar persecuciones en coche, pasajes sigilosos y combates cuerpo a cuerpo.",
            img: [
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454318/Ps5/A%20Way%20Out%20PS5%20Retro/a-way-out-ps5-retro-330x404_dhgoda.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454315/Ps5/A%20Way%20Out%20PS5%20Retro/a-way-out_7_gopu5m.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454315/Ps5/A%20Way%20Out%20PS5%20Retro/a-way-out_6-330x186_yc8yps.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454317/Ps5/A%20Way%20Out%20PS5%20Retro/a-way-out_5-330x186_suc2wc.jpg"
            ],
            price: "10080",
            status: "Active",
            createdAt: "2023-04-03T00:47:11.694Z",
            updatedAt: "2023-04-03T00:47:11.694Z",
            OrdersDetail: {
              quantity: 3,
              subtotal: 30240
            }
          },
          {
            name: "Alien Isolation PS5 Retro",
            "id": 5,
            description: "En una atmósfera que incluye temor, peligro y un alienígena impredecible, los jugadores encarnan el papel de Amanda, quien lucha por sobrevivir y cumplir su objetivo de saber cuál es la verdad detrás de la desaparición de su madre.",
            img: [
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454308/Ps5/Alien%20Isolation%20PS5%20Retro/alien-isolation_wgrtt3.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454320/Ps5/Alien%20Isolation%20PS5%20Retro/alien-isolation_4-330x185_ncfjpj.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454317/Ps5/Alien%20Isolation%20PS5%20Retro/alien-isolation_2-330x185_g8pnms.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454316/Ps5/Alien%20Isolation%20PS5%20Retro/alien-isolation_5-330x185_f6himr.jpg"
            ],
            price: "10080",
            status: "Active",
            createdAt: "2023-04-03T00:47:11.695Z",
            updatedAt: "2023-04-03T00:47:11.695Z",
            OrdersDetail: {
              quantity: 2,
              subtotal: 20160
            }
          },
          {
            name: "Batman Arkham Origins",
            id: 22,
            description: "La tercera entrega de la saga presenta la precuela de las dos anteriores para explorar los orígenes de Batman. Los jugadores disfrutarán de una aventura de acción en la que el sigilo es central para triunfar en su lucha contra los más peligrosos villanos.",
            img: [
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454242/Ps3/Batman%20Arkham%20Origins/Batman-Arkham-Origins-1-330x397_kwhyug.png",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454241/Ps3/Batman%20Arkham%20Origins/batman-arkham-origins-2-330x248_qf2fzs.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454240/Ps3/Batman%20Arkham%20Origins/batman-arkham-origins-6-330x248_j9yv6a.jpg",
              "https://res.cloudinary.com/dapq4icmj/image/upload/v1679454243/Ps3/Batman%20Arkham%20Origins/batman-arkham-origins-3-330x248_qyb7qz.jpg"
            ],
            price: "4520",
            status: "Active",
            createdAt: "2023-04-03T00:47:11.696Z",
            updatedAt: "2023-04-03T00:47:11.696Z",
            OrdersDetail: {
              quantity: 1,
              subtotal: 4520
            }
          }
        ]
      }
    ]
  }
  try {
    /* const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).send({ error: 'Carrito no encontrado' });
    } */

    /* const orders = await Order.findAll({
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
    }); */

    /* res.status(200).send({ orders }); */
    res.status(200).send(hardcodeo);
      
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Error al intentar obtener las ordenes' });
  }
};

const getAllOrders = async (req, res) => {
  
  try {
    const carts = await Cart.findAll();
    const orderPromises = carts.map(async (cart) => {
      const order = await Order.findOne({
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

      const idUser= order.userId; 
      const findUser= await User.findOne({
        where: {id: idUser},
        attributes: ['firstname', 'lastname', 'email', 'img'],
      });
      
      order.userId= findUser;

      return order;
    });
    const orders = await Promise.all(orderPromises);
    const filteredOrders = orders.filter(order => order !== null);
    res.status(200).send({ All_Orders: filteredOrders });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Error al intentar obtener las ordenes' });
  }
};



const pendingOrder = async (req, res) => {
  

  const { orderId } = req.body;

  console.log(orderId)

  try {
    const order = await Order.findOne({ where: { id: orderId } });
    console.log(order)

    if (!order) {
      return res.status(404).json({ message: 'No se encontró la orden' });
    }

    order.status = 'Pending Pay';

    await order.save();

    return res.status(200).json({ message: 'El estado de la orden se ha actualizado correctamente' });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Ocurrió un error al actualizar la orden' });
  }

};

const succesOrder = async (req, res) => {
  

  const { orderId } = req.body;

  // console.log(orderId)

  try {
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
      return res.status(404).json({ message: 'No se encontró la orden' });
    };

    let allVideogames= await Videogame.findAll();
   
    const videogamesOrder= order.videogames.map(v => ({
      id: v.id,
      quantity: v.OrdersDetail.quantity
    }));
  
    videogamesOrder.forEach(async (v) => {
      const product= allVideogames.find( p=> p.dataValues.id === v.id );
      if (product.dataValues.stock < 1) return res.status(500).json({message: `Without Stock of: "${product.dataValues.name}" videogame`});
      product.dataValues.stock -= v.quantity; 
      const findVideogame= await Videogame.findByPk(product.dataValues.id);
      await findVideogame.update({
        stock: product.dataValues.stock
      });
    });
    


    order.status = 'Completed Pay';

    await order.save();

    return res.status(200).json({ message: 'El estado de la orden se ha actualizado correctamente'});

  } catch (error) {
    res.status(500).json({ message: 'Ocurrió un error al actualizar la orden', error: error.message });
  }

};

const canceledOrder = async (req, res) => {
  

  const { orderId } = req.body;

  console.log(orderId)

  try {
    
    const order = await Order.findOne({ where: { id: orderId } });
    console.log(order)

    if (!order) {
      return res.status(404).json({ message: 'No se encontró la orden' });
    }

    order.status = 'Canceled';

    await order.save();

    return res.status(200).json({ message: 'El estado de la orden se ha actualizado correctamente' });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Ocurrió un error al actualizar la orden' });
  }

};




module.exports = { createOrder, getAllOrders, getOrders, pendingOrder, succesOrder, canceledOrder };