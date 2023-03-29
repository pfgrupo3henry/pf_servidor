const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('order', {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'Id'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'UserId'
        },
        orderDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: 'OrderDate'
        },
        totalAmount: {
            type: PriceType,
            field: 'TotalAmount'
        },
        status: {
            type: DataTypes.ENUM('Created', 'Processing', 'Canceled', 'Completed'), 
            allowNull: false,
            defaultValue: 'Created',
            field: 'Status'
        },
        payment_id:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
})
}