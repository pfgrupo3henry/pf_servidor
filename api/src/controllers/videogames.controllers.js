const {Videogame, Genre, Platform} = require('../db');
const axios = require('axios');
const {videogames} = require('../utils/data-videogames');

const createVideogame = async (req,res) => {
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


// const getAllGames = async () => {
//     let gamesInDb = await Videogame.findAll()
//     return gamesInDb;
// }

// const searchGameByName = async (name) => {
//     let findNameInDb = await Videogame.findAll({
//         where: {name : {[Op.iLike] : `%${name}%`}},
//         attributes:["id","name","description","image","price","platform","genre"],
//         include:{
//             model: Genre, Platform,
//             attributes: ['name'],
//             through:{
//                 attributes:[],
//             },
//         }
//      })

//      findNameInDb= findNameInDb.map(m=>{
//         return {
//         ...m.dataValues, 
//        genre: m.genre?.map(m=>m.name),
//        platform: m.platform?.map(m=>m.name)
//     }})
//     return findNameInDb;
// };

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

module.exports = {createVideogame};