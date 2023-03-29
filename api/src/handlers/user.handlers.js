const {User} = require('../db');


const postUser = async(req,res) => {

   try{
   const newUser = await User.create(req.body)   

   res.status(200).send({userId: newUser.id})
   }
  
   catch(e) {res.status(400).send({error: "The user couldn't be created"})}

}  


module.exports = {postUser}