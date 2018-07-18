'use strict';
module.exports = (sequelize, DataTypes) => {
  var StoreUsers = sequelize.define('StoreUsers', {
    storeId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    visitCnt: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    visitDate: DataTypes.DATE,
    orderCnt: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    paranoid:true
  });
  StoreUsers.associate = function(models) {
    // associations can be defined here
  };
  return StoreUsers;
};