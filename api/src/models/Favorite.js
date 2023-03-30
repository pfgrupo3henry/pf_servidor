const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('favorite', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    products: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
    }
})}