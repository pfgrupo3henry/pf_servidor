const bcrypt= require('bcrypt');

const hashPassword= async (userPost)=>{
    const salt= await bcrypt.genSaltSync(10);
    userPost.password = bcrypt.hashSync(userPost.password, salt);

    return userPost.password;
};

module.exports=  {
    hashPassword
}