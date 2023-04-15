const { DataTypes } = require('sequelize');
const {StatusType} = require("./../dataType");

module.exports = (sequelize) => {
  const WebReview = sequelize.define('webReview', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      },
    userId: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    rate: {
      type: DataTypes.ENUM("0","0.5","1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"),
    },
    status: {
      type: StatusType, 
      defaultValue: 'Active',
    }
  });
  return WebReview;
};