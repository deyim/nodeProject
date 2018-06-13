'use strict';
module.exports = (sequelize, DataTypes) => {
  var StoreCities = sequelize.define('StoreCities', {
    storeId: DataTypes.INTEGER,
    cityId: DataTypes.INTEGER
  }, {});
  StoreCities.associate = function(models) {
    // associations can be defined here
  };
  return StoreCities;
};