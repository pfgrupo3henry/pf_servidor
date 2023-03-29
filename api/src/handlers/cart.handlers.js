const {Cart} = require('../db');


const getCart = async(req,res) => {
    const { userId, newProduct } = req.body;
    try{
    const cart = await Cart.findOne({where: {userId: userId}})

    console.log(cart)
    if(!cart) {
        const newCart = await Cart.create({ userId: userId });
        
        res.status(200).send(newCart)
    }
    else {res.status(200).send(cart)}
    /* const products = cart.products || [] */
    }
    catch(e) {res.status(400).send(e)}
}  


module.exports = {getCart}