'use strict';
module.exports = (sequelize, DataTypes) => {
  var Cateory = sequelize.define('Cateory', {
    name: DataTypes.STRING
  }, {});
  Cateory.associate = function(models) {
    // associations can be defined here
  };
  return Cateory;
};