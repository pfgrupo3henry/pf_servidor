require('dotenv').config();
const bcrypt= require('bcrypt');
const { Sequelize, Op} = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_DEPLOY
} = process.env;



// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@localhost:${DB_HOST}/pfhenry`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// }); 


const sequelize = new Sequelize(DB_DEPLOY, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});



const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Videogame, Genre, Platform, User, Order, OrdersDetail , Review, Cart, Favorite } = sequelize.models;

User.prototype.isPasswordMatched= async(password, passwordFindUser)=>{
  const result= await bcrypt.compare(password, passwordFindUser);
  return result; //if matched, it returns true, otherwise it will return false
}

// Aca vendrian las relaciones (probando123)
// Product.hasMany(Reviews);
Videogame.belongsToMany(Genre, {through: "Videogames_Genre"});
Genre.belongsToMany(Videogame, {through: "Videogames_Genre"});

Videogame.belongsToMany(Platform, {through: "Platforms_Videogames"});
Platform.belongsToMany(Videogame, {through: "Platforms_Videogames"});


Order.belongsToMany(Videogame, { through: OrdersDetail });
Videogame.belongsToMany(Order, { through: OrdersDetail });



Cart.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Cart)

Cart.hasMany(Order, { foreignKey: 'cartId' });
Order.belongsTo(Cart, { foreignKey: 'cartId' });

Favorite.belongsTo(User);
User.hasOne(Favorite)

User.hasMany(Review);
Review.belongsTo(User);

Videogame.hasMany(Review);
Review.belongsTo(Videogame);





module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, 
  Op    // para importart la conexión { conn } = require('./db.js');
};