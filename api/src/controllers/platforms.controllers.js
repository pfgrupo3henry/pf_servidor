const {Platform} = require('../db');

const getGameByPlatform = async () => {
    let platformInDb = await Platform.findAll()
    return platformInDb;
};

const createPlatforms = async (req,res) => {
    try{
     
     const platforms = await Platform.bulkCreate([{name: "PS3"},{name: "PS4"},{name: "PS5"}])

     res.status(201).json(platforms)
    }
    catch(e) {res.status(404).json(console.log(e))}
}

module.exports = {getGameByPlatform, createPlatforms}