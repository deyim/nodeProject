'use strict';
module.exports = (sequelize, DataTypes) => {
  var Withdrawl = sequelize.define('Withdrawl', {
    total: DataTypes.INTEGER,
    totalCost: DataTypes.INTEGER,
    totalPgCost: DataTypes.INTEGER,
    totalStoreCost: DataTypes.INTEGER,
    ordersCnt: DataTypes.INTEGER,
    requestedDate: DataTypes.DATE,
    withdrawnDate: DataTypes.DATE,
    withdrawnChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Withdrawl.associate = function(models) {
    Withdrawl.belongsTo(models.Provider, {as: 'provider', foreignKey: 'providerId'});
    Withdrawl.belongsTo(models.Store, {as: 'store', foreignKey: 'storeId'});
    Withdrawl.hasMany(models.Order, {as: 'orders', foreignKey: 'withdrawlId'});
  };
  return Withdrawl;
};