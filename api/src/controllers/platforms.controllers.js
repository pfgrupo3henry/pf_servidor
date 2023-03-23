const {Platform} = require('../db');

const getGameByPlatform = async () => {
    let platformInDb = await Platform.findAll()
    return platformInDb;
};

module.exports = {getGameByPlatform}