'use strict';
module.exports = (sequelize, DataTypes) => {
  var Noticecode = sequelize.define('Noticecode', {
    code: DataTypes.STRING
  }, {});
  Noticecode.associate = function(models) {
    // associations can be defined here
  };
  return Noticecode;
};