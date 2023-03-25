const { createVideogame, searchGameByName, getGameById, getAllGames } = require ('../controllers/videogames.controllers.js');
const {Videogame} = require('../db');

const createVideogameHandler = async (req, res) => {
  const {name, description, image, price, platform, genre} = req.body;

  try {
    const newGame = await createVideogame(name, description, image, price, platform, genre);
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

const videogamesHandlers = async (req, res) => {
  const { name } = req.query;
  try {
  const results = name ? await searchGameByName(name) : await getAllGames();
  res.status(200).json(results);
  } catch (error){
      res.status(400).json({error: error.message})
  }
};

const videogameHandler = async (req, res) => {
  const { id } = req.params;
  try {
      const game = await getGameById(id);
      res.status(201).json(game);
  } catch (error) {
      res.status(400).json({ error: "No existe Videogame para ese ID" });
  }
      
};

const getGameById = async (value) => {
  if(value.length>5){
      const findDbID= await Videogame.findByPk(value, {include:Genre, Platform})
      const detailOfGame = {
          id:findDbID.id,
          name: findDbID.name,
          description: findDbID.description,
          image: findDbID.img,
          price: findDbID.price,
          platform: findDbID.platform.map(m=>m.name),
          genre: findDbID.genre.map(m=>m.name)
      }
      return detailOfGame
  }
};


const modifyVideogameHandler = async (req, res) => {
  const{ name, description, price } = req.body;
  try {
      const actualizado = await Videogame.update({
        description: description,
        price: price,
      },{
          where: { name }
      });
      res.status(201).json(actualizado);
  } catch(error) {
      res.status(400).json({ error: "Error al modificar" });
  }
};

module.exports = {
  createVideogameHandler, 
  videogamesHandlers, 
  videogameHandler, 
  modifyVideogameHandler
};