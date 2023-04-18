const {
  Cart,
  Order,
  Videogame,
  OrdersDetail,
  Payment,
  Genre,
  Platform,
  User,
} = require("../db");

const createOrder = async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    if (!cart.products.length) {
      return res.status(400).send({ error: "No products in cart" });
    }

    const order = await Order.create({
      userId: userId,
      cartId: cart.id,
    });

    for (const product of cart.products) {
      const videogame = await Videogame.findByPk(product.id);
      const subtotal = product.quantity * videogame.price;
      await order.addVideogame(videogame, {
        through: { quantity: product.quantity, subtotal: subtotal },
      });
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
    res.status(500).send({ error: "Error en la creacion de la orden" });
  }
};

const getOrders = async (req, res) => {
  const userId = req.params.id;

  try {
    const cart = await Cart.findOne({ where: { userId } });

    const users= await User.findOne({ where: { id: cart.userId } });

    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const orders = await Order.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: Videogame,
          through: {
            model: OrdersDetail,
            attributes: ["quantity", "subtotal"],
          },
        },
      ],
    });

    const filteredOrders = orders.filter((order) => order !== null).flat();

    const groupedOrders = filteredOrders.reduce((result, currentOrder) => {
      
      const existingOrder = result.find(
        (order) => order.userId === currentOrder.userId
      );

      if (existingOrder) {
        existingOrder.orders.push(currentOrder);
      } else {
        result.push({
          userId: currentOrder.userId,
          userInfo: users,
          orders: [currentOrder],
        });
      }

      return result;
    }, []);

    res.status(200).send({userOrder: groupedOrders });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Error al intentar obtener las ordenes del usuario" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const carts = await Cart.findAll();

    const userPromises = carts.map(async (cart) => {
      const user = await User.findOne({ where: { id: cart.userId } });

      return user;
    });

    const users = await Promise.all(userPromises);

    const orderPromises = carts.map(async (cart) => {
      const order = await Order.findAll({
        where: { cartId: cart.id },
        include: [
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
        ],
      });
      return order;
    });

    const orders = await Promise.all(orderPromises);

    const filteredOrders = orders.filter((order) => order !== null).flat();

    const groupedOrders = filteredOrders.reduce((result, currentOrder) => {
      
      const existingOrder = result.find(
        (order) => order.userId === currentOrder.userId
      );

      if (existingOrder) {
        existingOrder.orders.push(currentOrder);
      } else {
        result.push({
          userId: currentOrder.userId,
          userInfo: users.find((user) => user.id === currentOrder.userId),
          orders: [currentOrder],
        });
      }

      return result;
    }, []);

    res.status(200).send({ All_Orders: groupedOrders });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Error al intentar obtener las ordenes" });
  }
};

const pendingOrder = async (req, res) => {
  const { orderId } = req.body;

  console.log(orderId);

  try {
    const order = await Order.findOne({ where: { id: orderId } });
    console.log(order);

    if (!order) {
      return res.status(404).json({ message: "No se encontró la orden" });
    }

    order.status = "Pending Pay";

    await order.save();

    return res.status(200).json({
      message: "El estado de la orden se ha actualizado correctamente",
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Ocurrió un error al actualizar la orden" });
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
            attributes: ["quantity", "subtotal"],
          },
        },
      ],
    });
    // console.log(order);

    if (!order) {
      return res.status(404).json({ message: "No se encontró la orden" });
    }

    let allVideogames = await Videogame.findAll();

    const videogamesOrder = order.videogames.map((v) => ({
      id: v.id,
      quantity: v.OrdersDetail.quantity,
    }));

    videogamesOrder.forEach(async (v) => {
      const product = allVideogames.find((p) => p.dataValues.id === v.id);
      if (product.dataValues.stock < 1)
        return res.status(500).json({
          message: `Without Stock of: "${product.dataValues.name}" videogame`,
        });
      product.dataValues.stock -= v.quantity;
      const findVideogame = await Videogame.findByPk(product.dataValues.id);
      await findVideogame.update({
        stock: product.dataValues.stock,
      });
    });

    order.status = "Completed Pay";

    await order.save();
      
  } catch (error) {
    res.status(500).json({
      message: "Ocurrió un error al actualizar la orden",
      error: error.message,
    });
  }
};

const canceledOrder = async (req, res) => {
  const { orderId } = req.body;

  console.log(orderId);

  try {
    const order = await Order.findOne({ where: { id: orderId } });
    console.log(order);

    if (!order) {
      return res.status(404).json({ message: "No se encontró la orden" });
    }

    order.status = "Rejected Pay";

    await order.save();

    return res.status(200).json({
      message: "El estado de la orden se ha actualizado correctamente",
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Ocurrió un error al actualizar la orden" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrders,
  pendingOrder,
  succesOrder,
  canceledOrder,
};
