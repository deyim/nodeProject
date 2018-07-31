'use strict';
module.exports = (sequelize, DataTypes) => {
  var Withdrawl = sequelize.define('Withdrawl', {
    providerId: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    totalCost: DataTypes.INTEGER,
    totalPgCost: DataTypes.INTEGER,
    totalStoreCost: DataTypes.INTEGER,
    ordersCnt: DataTypes.INTEGER,
    withdrawnChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Withdrawl.associate = function(models) {
    Withdrawl.belongsTo(models.Provider, {as: 'provider', foreignKey: 'providerId'});
    Withdrawl.hasMany(models.Order, {as: 'orders', foreignKey: 'withdrawlId'});
  };
  return Withdrawl;
};