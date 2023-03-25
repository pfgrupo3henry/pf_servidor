const {Genre} = require('../db');

const getGenres= async (req,res) => {
    try {
    let genreInDb = await Genre.findAll()
    res.status(201).json(genreInDb);
    }
    catch(e) {res.status(404).json(console.log(e))}
};

const createGenres = async (req,res) => {
    try{
     
     const genres = await Genre.bulkCreate([{name: "Acción"},{name: "Aventura"},{name: "Combos"},{name: "Conducción"},{name: "Deportes"},{name: "Estrategia"},{name: "Infantiles"},{name: "Multijugador"},{name: "Rol"}])

     res.status(201).json(genres)
    }
    catch(e) {res.status(404).json(console.log(e))}
};

module.exports = {getGenres, createGenres}