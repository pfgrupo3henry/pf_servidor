const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('orderDetail', {

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
})
}