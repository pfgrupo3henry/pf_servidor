const {Genre} = require('../db');

const getGameByGenre = async () => {
    let genreInDb = await Genre.findAll()
    return genreInDb;
};

module.exports = {getGameByGenre}