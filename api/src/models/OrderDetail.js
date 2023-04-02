const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrdersDetail = sequelize.define('OrdersDetail', {
    // definición de atributos del modelo
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

  return OrdersDetail;
};