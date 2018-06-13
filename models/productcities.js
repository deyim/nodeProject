'use strict';
module.exports = (sequelize, DataTypes) => {
  var ProductCities = sequelize.define('ProductCities', {
    productId: DataTypes.INTEGER,
    cityId: DataTypes.INTEGER
  }, {});
  ProductCities.associate = function(models) {
    // associations can be defined here
  };
  return ProductCities;
};