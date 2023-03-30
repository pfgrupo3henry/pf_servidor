const { DataTypes } = require('sequelize');
const bcrypt= require('bcrypt');
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
      allowNull: false,
      field: "Firstname",
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Lastname",
      },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "Email",
    },
   /*  mobile: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: "Mobile",
    }, */
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
      allowNull: false,
      field: "Nationality",
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: StatusType,
      // allowNull: false,
      defaultValue: "Active",
      field: "Status",
    },
    refreshToken: {
      type: DataTypes.STRING,
    }
}, {
  hooks: {
    beforeCreate: async (user, options)=>{
      const salt= await bcrypt.genSaltSync(10);
      user.password= await bcrypt.hash(user.password, salt);
    } 
  },
})
}