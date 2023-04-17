const {Cart, Videogame, User} = require('../db');
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = process.env

const getCart = async (req, res) => {

  let { id } = req.params;
  id = parseInt(id)
  try {

    const cart = await Cart.findOne({ where: { userId: id } });
    
    if (!cart) {

      await Cart.create({ userId: id });
      res.status(200).send({ id, products: [] });

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
      
      res.status(200).send({ id, products: newProducts });
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
        newProducts.sort((a, b) => a.id - b.id);
        await cart.update({ products: newProducts });
      }
      else {
      let newProducts = cart.products.concat(product)
      newProducts.sort((a, b) => a.id - b.id);
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
  
  const throwItemsCart = async (req, res) => {

    let { userId, gameId } = req.body;
    userId = parseInt(userId)
    gameId = parseInt(gameId)
    try {   
      const user = await User.findByPk(userId)

    let cart = await Cart.findOne({ where: { userId: user.id} });
     
    let deleteGameInCart = cart.products.filter(el => el.id !== gameId);
    
    await cart.update({ products: deleteGameInCart });

    const productIds = deleteGameInCart.map((product) => product.id);

      const videogames = await Videogame.findAll({ where: { id: productIds } });
      
      const newProducts = cart.products.map((product) => {

        const videogame = videogames.find((v) => v.id === product.id);
        return {

          ...product,
          ...videogame.toJSON(),
          quantity: product.quantity,
        };
      });

      res.status(200).send({ id: userId, products: newProducts });
    
    } catch (e) {
      res.status(400).send(e);
    }
  };

  const emptyCart = async (req,res) => {
    let { userId} = req.body;
    userId = parseInt(userId)
    try {
     
    const user = await User.findByPk(userId)
    
    let cart = await Cart.findOne({ where: { userId: user.id } });
      
    await cart.update({ products: [] });
      
    res.status(200).send(cart);


    } catch (e) {
      res.status(400).send(e);
    }
  }



  module.exports = { getCart, putCart, deleteItemsCart, throwItemsCart, emptyCart};