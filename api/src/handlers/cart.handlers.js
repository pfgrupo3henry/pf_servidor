const {Cart, Videogame} = require('../db');


const getCart = async(req,res) => {
    const { userId, products } = req.body;
    try{
    const cart = await Cart.findOne({where: {userId: userId}})
    
    if(!cart) {
        const newCart = await Cart.create({ userId: userId });
        
        res.status(200).send(newCart)
    }
   
    else {
    const newProducts = await Promise.all(products.map( async(el) => {

    let game = await Videogame.findByPk(el.gameId)
    
    const newObj = {
        id: game.id, 
        name: game.name, 
        decription: game.description,
        img: game.img,
        price: game.price,
        status: game.status,
        quantity: el.quantity
    }
     
    return newObj
    }))

    res.status(200).send(newProducts)}
    }
    catch(e) {res.status(400).send(e)}
}  


module.exports = {getCart}