const {Favorite, Videogame, User} = require('../db');
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = process.env

const getAllFavorites = async(token) => {
    try{
 
    if(!token) {
        throw new Error('User not authorized');
    }
  
    else if(!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined')
    }

    const decoded = jwt.verify(token,JWT_SECRET)

    const user = await User.findByPk(decoded.id)
    
    let favorites = await Favorite.findOrCreate({where: {userId: user.id}})

    let products = favorites[0].products || []
 
    if (products.length === 0) {
        return products
    }
    
    products = await Promise.all(products.map( async(el) => {
    
    let game = await Videogame.findByPk(el.id)
    return {
        id: game.id,
        name: game.name,
        description: game.description,
        img: game.img,
        price: game.price,
        status: game.status
    }
     
    } ))
     
    return products
    }
    
    catch(error) {
        console.error(error)
        return { message: "An error occurred while getting all products" }}
};


const putProducts = async(products, token) => {
    try{
    
    if(!token) {
        throw new Error('User not authorized')
    }

    else if(!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined')
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    const user = await User.findByPk(decoded.id)

    let favorites = await Favorite.findOne({where: {userId: user.id}})
    
    favorites.products = products

    await favorites.save();

    return { message: "Products updated successfully" }
    }
    
    catch(error) {
        console.error(error)
        return { message: "An error occurred while updating the products" }}
}  


module.exports = {getAllFavorites, putProducts}