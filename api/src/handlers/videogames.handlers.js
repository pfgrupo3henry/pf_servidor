const { createVideogame, searchGameByName, getGameById, getAllGames } = require ('../controllers/videogames.controllers.js');
const {Videogame, Platform, Genre} = require('../db');
const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: "dapq4icmj",
  api_key: "182849148671358",
  api_secret: "LiNdU8c3mGXxCnRed_xiA9xQtLk"
});

// const createVideogameHandler = async (req, res) => {
//   const {name, description, image, price, platform, genre} = req.body;

//   try {
//     const newGame = await createVideogame(name, description, image, price, platform, genre);
//     res.status(201).json(newGame);
//   } catch (error) {
//     res.status(400).json({error: error.message});
//   }
// };

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

const modifyVideogameHandler = async (req, res) => {
  const{ id, name, description, platform, genre, price, stock } = req.body;
  try {


    const actualizado = await Videogame.update({
      name: name, description: description, price: price, stock: stock
    },{
      where: { id: id }
    });
  
    let videogame = await Videogame.findOne({
      where: { id: id },
      include: [
        {
          model: Platform,
          attributes: ['name']
        },
        {
          model: Genre,
          attributes: ['name']
        }
      ],
    });

    if(!videogame) {
      throw "The videogame with the name selected isn't available" 
    }


    if(platform) {

    const platformDb = await Platform.findOne({where: {name: platform}})

    await videogame.setPlatforms([]);

    await videogame.addPlatform(platformDb, { through: { status: platform } });

    }


    if(genre) {

      const genreDb = await Genre.findOne({where: {name: genre}})
  
      await videogame.setGenres([]);
  
      await videogame.addGenre(genreDb, { through: { status: genre} });
  
      }

      videogame = await Videogame.findOne({
        where: { id: id },
        include: [
          {
            model: Platform,
            attributes: ['name']
          },
          {
            model: Genre,
            attributes: ['name']
          }
        ],
      });
 
    videogame= {
      id: videogame.id,
      name: videogame.name, 
      description: videogame.description,
      img: videogame.img,
      price: videogame.price,
      genre: videogame.genres[0].name,
      platform: videogame.platforms[0].name,
      stock: videogame.stock
      } 

    res.status(201).json(videogame);

  } catch(error) {
      res.status(400).json({ error: "Error al modificar", message: error });
  }
};

module.exports = { 
  getVideogames,  
  modifyVideogameHandler,
  getVideogameById
};