const {Cart, Videogame} = require('../db');


const getCart = async (req, res) => {

  const { userId } = req.body;
  
  try {

    const cart = await Cart.findOne({ where: { userId: userId } });
    

    if (!cart) {

      await Cart.create({ userId: userId });
      res.status(200).send({ userId, products: [] });

    } else {

      const productIds = cart.products.map((product) => product.id);

      const videogames = await Videogame.findAll({ where: { id: productIds } });

      const newProducts = cart.products.map((product) => {

        const videogame = videogames.find((v) => v.id === product.id);
        return {

          ...product,
          ...videogame.toJSON(),
          quantity: product.quantity,
        };
      });
      
      res.status(200).send({ userId, products: newProducts });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};


  const putCart = async (req, res) => {

    const { userId } = req.body;

    const products = req.body.products || [];

    try {

      let cart = await Cart.findOne({ where: { userId: userId } });

      if (!cart) {
        cart = await Cart.create({ userId: userId });
      }

      await cart.update({ products: products });

      res.status(200).send({ userId, products });

    } catch (e) {
      res.status(400).send(e);
    }
  };

  
  module.exports = { getCart, putCart};
  

