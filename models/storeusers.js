'use strict';
module.exports = (sequelize, DataTypes) => {
  var StoreUsers = sequelize.define('StoreUsers', {
    storeId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  StoreUsers.associate = function(models) {
    // associations can be defined here
  };
  return StoreUsers;
};