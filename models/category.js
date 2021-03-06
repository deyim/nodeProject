'use strict';
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    engName: DataTypes.STRING(1)
  }, {});
  Category.associate = function(models) {
    Category.hasMany(models.Product, {as: 'products', foreignKey: 'categoryId'});
    Category.hasMany(models.Productcode, {as: 'productcodes', foreignKey: 'categoryId'});
  };
  return Category;
};