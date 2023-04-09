const { DataTypes, TEXT } = require('sequelize');
const {StatusType} = require("./../dataType")
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogame', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Id"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    img: {
			type: DataTypes.ARRAY(TEXT),
			allowNull: false
		},
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    status: {
      type: StatusType, 
      allowNull: false,
      defaultValue: 'Active',
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  }
  });
};
