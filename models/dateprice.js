'use strict';
module.exports = (sequelize, DataTypes) => {
  var DatePrice = sequelize.define('DatePrice', {
    date: DataTypes.DATE,
    price: DataTypes.FLOAT
  }, {});
  DatePrice.associate = function(models) {
    // associations can be defined here
  };
  return DatePrice;
};