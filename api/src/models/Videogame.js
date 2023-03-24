const { DataTypes, TEXT } = require('sequelize');
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
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
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
    rating: {
      type: DataTypes.FLOAT
    },
  });
};
