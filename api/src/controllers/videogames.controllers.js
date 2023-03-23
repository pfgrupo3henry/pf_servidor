const {Videogame, Genre, Platform} = require('../db');
const axios = require('axios');

const createVideogame = async (
    name, description, image, price, platform, genre ) => {
        if(name){
            let findDB = await Pokemon.findOne({
                where: {name}
            })
            if(findDB) throw new Error('the videogame already exists...')
            else {const videogameCreate = await Videogame.bulkCreate({
                name: name,
                description: description,
                image: image,
                price: price,
            })

            const genreDb = await Genre.findAll({
                where: {name:genre}
            })
            const platformDb = await Platform.findAll({
                where: {name:platform}
            })

            videogameCreate.addGenre(genreDb)
            videogameCreate.addPlatform(platformDb)
            return 'Videogame created successfully'
        }
        } else {
            return 'You must enter a name'
        }
    };

const getAllGames = async () => {
    let gamesInDb = await Videogame.findAll()
    return gamesInDb;
}

const searchGameByName = async (name) => {
    let findNameInDb = await Videogame.findAll({
        where: {name : {[Op.iLike] : `%${name}%`}},
        attributes:["id","name","description","image","price","platform","genre"],
        include:{
            model: Genre, Platform,
            attributes: ['name'],
            through:{
                attributes:[],
            },
        }
     })

     findNameInDb= findNameInDb.map(m=>{
        return {
        ...m.dataValues, 
       genre: m.genre?.map(m=>m.name),
       platform: m.platform?.map(m=>m.name)
    }})
    return findNameInDb;
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

module.exports = {createVideogame, searchGameByName, getGameById, getAllGames };