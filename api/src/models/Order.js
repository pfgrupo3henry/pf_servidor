const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('order', {

    state: {
        type: DataTypes.ENUM(["enCarrito", "creada", "confirmada", "cancelada", "completada"])
    },
    payment_state: {
        type: DataTypes.STRING,
        allowNull: true,
    },

})
}