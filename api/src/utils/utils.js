const {Videogame, Genre, Platform, Op} = require('../db');

/* const searchGameByName = async (name) => {
    let findNameInDb = await Videogame.findAll({
        where: {name : {[Op.iLike] : `%${name}%`}},
        attributes:["id","name","description","img","price"],
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
}; */

const searchGameByName = async(name) =>{

    const videogames= await getAllGames();
    
        if(!name) {return videogames;}
        
        
        else if(name) {
            const wantedVideogame= videogames.filter(v=> v.name.toLowerCase().includes(name.toLowerCase())); 
            

           if(wantedVideogame.length === 0) {throw new Error('Videogame not found')}

           return wantedVideogame

        }
        }


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
        platform: m.platforms[0].name
    }}) 
    
    
    return gamesInDb
}

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


module.exports = {searchGameByName, getAllGames, getGameById}