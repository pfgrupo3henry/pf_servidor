const { DataTypes, TEXT } = require('sequelize');
const {RoleType, StatusType} = require("./../dataType")

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
      },
    firstname: {
      type: DataTypes.STRING,
      field: "Firstname",
    },
    lastname: {
      type: DataTypes.STRING,
      field: "Lastname",
      },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "Email",
    },
    mobile: {
      type: DataTypes.STRING,
      unique: true,
      field: "Mobile",
    }, 
    password: {
      type: DataTypes.STRING,
      field: "Password",
    },
    role: {
      type: RoleType,
      allowNull: false,
      defaultValue: "User",
      field: "Role",
    },
    nationality: {
      type: DataTypes.STRING,
      field: "Nationality",
    },
    img: {
      type: DataTypes.ARRAY(TEXT),
    },
    status: {
      type: StatusType,
      allowNull: false,
      defaultValue: "Active",
      field: "Status",
    },
    refreshToken: {
      type: DataTypes.STRING,
    }
})
}