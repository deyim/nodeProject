'use strict';
module.exports = (sequelize, DataTypes) => {
  var Cateory = sequelize.define('Cateory', {
    name: DataTypes.STRING
  }, {});
  Cateory.associate = function(models) {
    Category.hasMany(db.Product, {as: 'products'});
  };
  return Cateory;
};