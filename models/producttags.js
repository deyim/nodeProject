'use strict';
module.exports = (sequelize, DataTypes) => {
  var ProductTags = sequelize.define('ProductTags', {
    productId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {});
  ProductTags.associate = function(models) {
    // associations can be defined here
  };
  return ProductTags;
};