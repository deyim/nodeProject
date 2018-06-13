'use strict';
module.exports = (sequelize, DataTypes) => {
  var ProductNations = sequelize.define('ProductNations', {
    productId: DataTypes.INTEGER,
    nationId: DataTypes.INTEGER
  }, {});
  ProductNations.associate = function(models) {
    // associations can be defined here
  };
  return ProductNations;
};