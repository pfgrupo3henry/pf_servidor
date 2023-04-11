const {Videogame, Genre, Platform} = require('../db');
const axios = require('axios');
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

const searchGameByName = async(name) =>{

  const videogames= await getAllGames();
  
      if(!name) {return videogames;
      
      }else if(name) {
          const wantedVideogame= videogames.filter(v=> v.name.toLowerCase().includes(name.toLowerCase())); 
          
              if(wantedVideogame.length === 0) {throw new Error('Videogame not found')}

              return wantedVideogame

      }
};

const getGameById = async (value) => {
   
  const findDbID= await Videogame.findByPk(value, { include: [Genre, Platform] })
  const detailOfGame = {
      id:findDbID.id,
      name: findDbID.name,
      description: findDbID.description,
      image: findDbID.img,
      price: findDbID.price,
      platform: findDbID.platforms[0].name,
      genre: findDbID.genres[0].name
  }
  return detailOfGame

};

const getAllGames = async () => {
  let gamesInDb = await Videogame.findAll({
      include: [
          {
              model: Genre,
              attributes: ['name'],
              through: {
                  attributes: [],
              },
          },
          {
              model: Platform,
              attributes: ['name'],
              through: {
                  attributes: [],
              }
          },
      ],
  })
  

      
  gamesInDb= gamesInDb.map(m=>{
      return {
      id: m.id,
      name: m.name, 
      description: m.description,
      img: m.img,
      price: m.price,
      genre: m.genres[0].name,
      platform: m.platforms[0].name,
      stock: m.stock
  }}) 
  
  
  return gamesInDb
};

module.exports = {
  createVideogame,
  createVideogameDb,
  getAllGames,
  getGameById,
  searchGameByName
};