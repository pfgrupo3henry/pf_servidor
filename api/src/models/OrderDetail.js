const { DataTypes } = require('sequelize');
const {PriceType} = require("./../dataType")

module.exports = (sequelize) => {
    sequelize.define('orderDetail', {
        
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'Id'
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'OrderId'
        },
        videogameId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'VideogameId'
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'Quantity',
            validate:{
                min: 1,
              }
        },
        unitPrice: {
            type: PriceType,
            allowNull: false,
            field: 'UnitPrice',            
        },
        totalAmount: {
            type: PriceType,
            allowNull: false,
            field: 'TotalAmount',            
        },
})
}