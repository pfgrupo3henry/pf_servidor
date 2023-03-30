const {Favorite, Videogame, User} = require('../db');
const { getAllFavorites, putProducts} = require ('../controllers/favorites.controllers');

const getFavorites = async(req,res) => {
    try{
    const token = req.cookies.refreshToken  // Obtener el valor de la cookie refreshToken

    const favorites = await getAllFavorites(token)
        
    res.status(200).send(favorites)
    }
    
    catch(e) {res.status(400).json({ message: 'GetFavorites Error', error: e})}
};


const putFavorites = async(req,res) => {
try{
    const {products} = req.body

    const token = req.cookies.refreshToken

    const favorites = await putProducts(products, token)

    res.status(200).send(favorites)
    }
    
    catch(e) {res.status(400).send({message: "putFavorites ERROR"})}
}  


module.exports = {getFavorites, putFavorites}