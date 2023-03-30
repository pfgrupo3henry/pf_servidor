const { User }= require ('../db');

const isAdmin= async(req, res, next)=>{
    console.log(req.user);
    const {email}= req.user;
    const adminUser= await User.findOne({where: {email: email}});
    if (adminUser.role !== "Admin") {
        throw new Error('You are not admin');
    } else{
        next();
    }
};

module.exports= {
    isAdmin,
}