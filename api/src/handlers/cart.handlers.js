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
      console.log(videogames)

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

    const product = req.body.products || [];

    try {

      let cart = await Cart.findOne({ where: { userId: userId } });
      
      if (!cart) {
        cart = await Cart.create({ userId: userId });
      }
      

      let gameInCart = cart.products.filter(el => el.id === product.id)[0];
      
      if(gameInCart !== undefined) {
        gameInCart = {id: gameInCart.id, quantity: gameInCart.quantity + product.quantity}
        let newProducts = cart.products.filter(el => el.id !== gameInCart.id);
        newProducts = newProducts.concat(gameInCart)
        await cart.update({ products: newProducts });
      }
      else {
      let newProducts = cart.products.concat(product)

       await cart.update({ products: newProducts });
      }
      
      res.status(200).send(cart);


    } catch (e) {
      res.status(400).send(e);
    }
  };

  const deleteItemsCart = async (req, res) => {

    const { userId } = req.body;

    const product = req.body.products || [];

    try {

      let cart = await Cart.findOne({ where: { userId: userId } });
      
      
      if (!cart) {
        cart = await Cart.create({ userId: userId });
      }

      let gameInCart = cart.products.filter(el => el.id === product.id)[0];
      
      if(gameInCart !== undefined && gameInCart.quantity > 1) {
        gameInCart = {id: gameInCart.id, quantity: gameInCart.quantity - 1}
        let newProducts = cart.products.filter(el => el.id !== gameInCart.id);
        newProducts = newProducts.concat(gameInCart)
        await cart.update({ products: newProducts });
      }
      else {
      let newProducts = cart.products.filter(el => el.id !== product.id)

       await cart.update({ products: newProducts });
      }
      
      res.status(200).send(cart);


    } catch (e) {
      res.status(400).send(e);
    }
  };
  
  module.exports = { getCart, putCart, deleteItemsCart};
  
