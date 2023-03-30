const {Favorite, Videogame, User} = require('../db');
const jwt = require("jsonwebtoken")

const getAllFavorites = async(token) => {
    try{
 
    if(!token) {
        throw('User not authorized');
    }

    const decoded = jwt.verify(token,"secret")

    const user = await User.findByPk(decoded.id)

    let favorites = await Favorite.findOrCreate({where: {userId: user.id}})
    
    const products = favorites.products || []

    return products
    }
    
    catch(e) {throw ('GetAllFavorites Error' )}
};


const putProducts = async(products, token) => {
    try{
    
    if(!token) {
            throw('User not authorized');
    }

    const decoded = jwt.verify(token, "secret")

    const user = await User.findByPk(decoded.id)

    let favorites = await Favorite.findOne({where: {userId: user.id}})
    
    favorites.products = products

    await favorites.save();

    res.status(200).send(products)
    }
    
    catch(e) {res.status(400).send({message: e})}
}  


module.exports = {getAllFavorites, putProducts}