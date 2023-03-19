const { DataTypes } = require('sequelize');
const bcrypt= require('bcrypt');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
})
}