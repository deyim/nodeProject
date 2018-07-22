'use strict';
module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define('Order', {
    price: DataTypes.INTEGER,
    realPrice: DataTypes.FLOAT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    countType: DataTypes.STRING,
    count: DataTypes.INTEGER,
    storeCost: DataTypes.INTEGER,
    pgCost: DataTypes.INTEGER,
    childCount: DataTypes.INTEGER,
    withdrawnChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Order.associate = function(models) {
    Order.hasOne(models.OrderStatus, {as: 'orderStatus', foreignKey: 'orderId'});
    Order.belongsTo(models.Product, {as: 'product'});
    Order.belongsTo(models.User, {as: 'buyer'});
    Order.belongsTo(models.Provider, {as: 'provider'});
    Order.belongsTo(models.Store, {as: 'store'});
    Order.belongsTo(models.Ordercode, {as: 'ordercode'});
    Order.hasMany(models.ServiceUser, {as: 'serviceUsers', foreignKey: 'orderId'});
    Order.hasOne(models.Payinfo, {as: 'payinfo', foreignKey: 'orderId'});
    Order.hasOne(models.CancelRequest, {as: 'cancelRequest', foreignKey: 'orderId'});
    Order.belongsTo(models.Withdrawl, {as: 'withdrawl', foreignKey: 'withdrawlId'});
    Order.belongsTo(models.Option, {as: 'option', foreignKey:'optionId'});
  
  };
  return Order;
};