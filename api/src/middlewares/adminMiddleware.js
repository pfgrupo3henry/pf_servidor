const { User }= require ('../db');

const isAdmin= async(req, res, next)=>{
    const {email}= req.user;
    const adminUser= await User.findOne({where: {email: email}});
    if (adminUser.role !== "Admin") {
        res.status(400).send('You are not Admin');
    } else{
        next();
    }
};

module.exports= {
    isAdmin,
}