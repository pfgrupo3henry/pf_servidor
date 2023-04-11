const { createVideogame, searchGameByName, getGameById, getAllGames } = require ('../controllers/videogames.controllers.js');
const {Videogame, Platform, Genre} = require('../db');

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
  const{ id, name, description, img, platform, genre } = req.body;

  try {
    
    const actualizado = await Videogame.update({
      name: name, description: description, img: img
    },{
      where: { id: id }
    });

    let videogame = await Videogame.findByPk(id, {
      include: [
        {
          model: Platform,
          through: "Platforms_Videogames",
        },
      ],
    });

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

    videogame = await Videogame.findByPk(id, {
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
      platform: videogame.platforms[0].name
      } 

    res.status(201).json(videogame);
  } catch(error) {
      res.status(400).json({ error: "Error al modificar" });
  }
};

module.exports = { 
  getVideogames,  
  modifyVideogameHandler,
  getVideogameById
};