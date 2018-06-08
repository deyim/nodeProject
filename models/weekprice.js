'use strict';
module.exports = (sequelize, DataTypes) => {
  var WeekPrice = sequelize.define('WeekPrice', {
    mon: DataTypes.FLOAT,
    tue: DataTypes.FLOAT,
    wed: DataTypes.FLOAT,
    thu: DataTypes.FLOAT,
    fri: DataTypes.FLOAT,
    sat: DataTypes.FLOAT,
    sun: DataTypes.FLOAT
  }, {});
  WeekPrice.associate = function(models) {
    // associations can be defined here
  };
  return WeekPrice;
};