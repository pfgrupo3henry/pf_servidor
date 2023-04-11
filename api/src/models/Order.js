const { DataTypes } = require("sequelize");
const { PriceType } = require("./../dataType");

module.exports = (sequelize) => {
  sequelize.define("order", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    userId: {
      type: DataTypes.INTEGER
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "cartId",
    },
    totalAmount: {
      type: PriceType,
      field: "TotalAmount",
    },
    status: {
      type: DataTypes.ENUM("Pending Pay", "Completed Pay", "Rejected Pay"),
      allowNull: false,
      defaultValue: "Pending Pay",
      field: "Status",
    },
    // orderDate: {
    //     type: DataTypes.DATEONLY,
    //     allowNull: false,
    //     field: 'OrderDate'
    // },

    // orderProducts: {
    //     type: DataTypes.ARRAY(DataTypes.JSON),
    //     allowNull: true
    // },

  });
};
