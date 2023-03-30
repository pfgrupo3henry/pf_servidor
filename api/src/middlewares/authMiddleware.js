const { User }= require ('../db');
const jwt= require('jsonwebtoken');

const authMiddleware= async(req, res, next)=>{
    if (req?.headers?.authorization?.startsWith('Bearer')){
       let token= req.headers.authorization.split(" ")[1];
    //    console.log(req.headers.authorization);
        try{
            if (token){
                const decoded= jwt.verify(token, process.env.JWT_SECRET);
                // console.log(decoded);
                const user= await User.findByPk(decoded?.id); 
                req.user= user;
                next();
            }
        }catch(error){
            res.status(500).send(error.message, 'Not Authorized, token expired, please login again')
        }
    } else{
        res.status(500).send('There is no token attached to header');
    }
};


module.exports= {
    authMiddleware,
}