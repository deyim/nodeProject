'use strict';
module.exports = (sequelize, DataTypes) => {
  var StoreVisit = sequelize.define('StoreVisit', {
    userId: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER,
    visitedAt: {
      type: DataTypes.DATEONLY,
      defaultValue: new Date()
    }
  }, {});
  StoreVisit.associate = function(models) {
    StoreVisit.belongsTo(models.User, {as: 'user', foreignKey: 'userId'});
    StoreVisit.belongsTo(models.Store, {as: 'store', foreignKey: 'storeId'});
  };
  return StoreVisit;
};