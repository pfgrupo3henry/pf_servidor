const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('OrdersDetail', {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    videogameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'videogames',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });
};
