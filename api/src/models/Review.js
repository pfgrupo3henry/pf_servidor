const { DataTypes } = require('sequelize');
const {StatusType} = require("./../dataType");

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    videogameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    rate: {
      type: DataTypes.ENUM("0","0.5","1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"),
      allowNull: false,
    },
    status: {
      type: StatusType, 
      allowNull: false,
      defaultValue: 'Active',
    }
  });
  return Review;
};