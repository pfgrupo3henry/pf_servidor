const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('cart', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    products: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
    }
})}