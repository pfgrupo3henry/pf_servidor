const { DataTypes, TEXT } = require('sequelize');
const { PriceType } = require('../dataType');

module.exports = (sequelize) => {
    sequelize.define('Payment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'Id'
        },
        type: {
            type: DataTypes.ENUM('MercadoPago'), 
            allowNull: false,
            defaultValue: 'MercadoPago',
            field: 'Type'
        },
        info: {
            type: DataTypes.JSON
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};