'use strict';
module.exports = (sequelize, DataTypes) => {
  var Option = sequelize.define('Option', {
    title: DataTypes.STRING,
  }, {});
  Option.associate = function(models) {
    Option.hasMany(models.Price, {as:'prices', foreignKey: 'optionId'});
    Option.belongsTo(models.Product, {as: 'product', foreignKey: 'productId'});
    Option.hasMany(models.Order, {as:'options', foreignKey: 'optionId'});
  };
  return Option;
};