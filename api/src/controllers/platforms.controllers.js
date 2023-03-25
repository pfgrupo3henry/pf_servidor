const {Platform} = require('../db');

const getPlatforms = async (req,res) => {
    
    try {
        let platformInDb = await Platform.findAll()
        res.status(201).json(platformInDb);
        }
        catch(e) {res.status(404).json(console.log(e))}
};

const createPlatforms = async (req,res) => {
    try{
     
     const platforms = await Platform.bulkCreate([{name: "PS3"},{name: "PS4"},{name: "PS5"}])

     res.status(201).json(platforms)
    }
    catch(e) {res.status(404).json(console.log(e))}
}

module.exports = {getPlatforms, createPlatforms}