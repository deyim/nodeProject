'use strict';
module.exports = (sequelize, DataTypes) => {
  var StoreNations = sequelize.define('StoreNations', {
    storeId: DataTypes.INTEGER,
    nationId: DataTypes.INTEGER
  }, {});
  StoreNations.associate = function(models) {
    // associations can be defined here
  };
  return StoreNations;
};