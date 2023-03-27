const {Videogame, Genre, Platform} = require('../db');
const axios = require('axios');
const {searchGameByName, getAllGames, getGameById} = require('../utils/utils');
const videogames = require('../utils/data-videogames');

const createVideogameDb = async (req,res) => {
    try {
     
      await Promise.all(videogames.map(async (el) => { 
        
        const newGame = await Videogame.create(el);

        const genreDb = await Genre.findOne({where: {name: el.genre}})

        await newGame.addGenre(genreDb)

        const platformDb = await Platform.findOne({where: {name: el.platform}})

        await newGame.addPlatform(platformDb)

      })); 

     res.status(201).send("Juegos Creados")
    }
    catch(e) {res.status(404).json(console.log(e))}
}


const createVideogame = async (req, res) => {
  const {platform, genre} = req.body;

  try {
    const newGame = await Videogame.create(req.body); 
    const genreDb = await Genre.findOne({where: {name: genre}})
    
    if(!genreDb) {throw new Error("the genre selected doesnt exist in the database, please create one..")}
    
    await newGame.addGenre(genreDb)
    
    const platformDb = await Platform.findOne({where: {name: platform}})
    
    if(!platformDb) {throw new Error("the platform selected doesnt exist in the database, please create one..")} 
    
    await newGame.addPlatform(platformDb)
    
    console.log(newGame)
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

const getVideogames = async (req, res) => {
  const { name } = req.query;
  
  try {
  const results = name ? await searchGameByName(name) : await getAllGames();
  res.status(200).json(results);
  } catch (error){
      res.status(400).json({error: error.message})
  }
};


const getVideogameById = async (req, res) => {
  const { id } = req.params;
  try {
      const game = await getGameById(id);
      res.status(201).json(game);
  } catch (error) {
      res.status(400).json({ error: "No existe Videogame para ese ID" });
  }
      
};
 



// const getGameById = async (value) => {
//     if(value.length>5){
//         const findDbID= await Videogame.findByPk(value, {include:Genre, Platform})
//         const detailOfGame = {
//             id:findDbID.id,
//             name: findDbID.name,
//             description: findDbID.description,
//             image: findDbID.img,
//             price: findDbID.price,
//             platform: findDbID.platform.map(m=>m.name),
//             genre: findDbID.genre.map(m=>m.name)
//         }
//         return detailOfGame
//     }
// };

module.exports = {
  createVideogame,
  createVideogameDb,
  getVideogames,
  getVideogameById
};