const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
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
    }
  });
  return Review;
};