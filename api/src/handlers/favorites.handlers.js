const {Favorite, Videogame, User} = require('../db');
const { getAllFavorites, putProducts} = require ('../controllers/favorites.controllers');

const getFavorites = async(req,res) => {
    let { id } = req.params;
    id = parseInt(id)
    try{
      
          const favorites = await Favorite.findOne({ where: { userId: id } });
          
          if (!favorites) {
      
            await Favorite.create({ userId: id });
            res.status(200).send({ id, products: [] });
      
          } else {
      
            const productIds = favorites.products.map((product) => product.id);
            const videogames = await Videogame.findAll({ where: { id: productIds } });
            
      
            const newProducts = favorites.products.map((product) => {
      
              const videogame = videogames.find((v) => v.id === product.id);
              return {
      
                ...product,
                ...videogame.toJSON()
              };
            });
            
            res.status(200).send({ id, products: newProducts });
          }
    



    /* const token = req.cookies.refreshToken  // Obtener el valor de la cookie refreshToken

    const favorites = await getAllFavorites(token)
        
    res.status(200).send(favorites) */
    }
    
    catch(e) {res.status(400).json({ message: 'GetFavorites Error', error: e})}
};


const putFavorites = async(req,res) => {
try{
    
    const { userId } = req.body;

    const product = req.body.products || [];


      let favorites = await Favorite.findOne({ where: { userId: userId } });
      
      if (!favorites) {
        favorites = await Favorite.create({ userId: userId });
      }
      

      let gameInFavorites = favorites.products.filter(el => el.id === product.id)[0];
      if(gameInFavorites !== undefined) {
        res.status(200).send(favorites)
      }
      else {
      let newProducts = favorites.products.concat(product)

       await favorites.update({ products: newProducts });
      }

    /* const token = req.cookies.refreshToken

    const favorites = await putProducts(products, token) */ //para cuando funcionen los tokens

    res.status(200).send(favorites)
}
    
    catch(e) {res.status(400).send({message: "putFavorites ERROR"})}
}  

const deleteFavorites = async (req, res) => {

    let { userId, gameId } = req.body;
    userId = parseInt(userId)
    gameId = parseInt(gameId)
    try {   
      const user = await User.findByPk(userId)

    let favorites = await Favorite.findOne({ where: { userId: user.id} });
     
    let deleteInFavorites = favorites.products.filter(el => el.id !== gameId);
    
    await favorites.update({ products: deleteInFavorites });

    const productIds = deleteInFavorites.map((product) => product.id);

      const videogames = await Videogame.findAll({ where: { id: productIds } });
      
      const newProducts = favorites.products.map((product) => {

        const videogame = videogames.find((v) => v.id === product.id);
        return {

          ...product,
          ...videogame.toJSON()
        };
      });

      res.status(200).send({ id: userId, products: newProducts });
    
    } catch (e) {
      res.status(400).send(e);
    }
  };


module.exports = {getFavorites, putFavorites, deleteFavorites}