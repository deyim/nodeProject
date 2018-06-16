'use strict';
module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define('Order', {
    price: DataTypes.INTEGER,
    realPrice: DataTypes.FLOAT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    countType: DataTypes.STRING,
    count: DataTypes.INTEGER,
    childCount: DataTypes.INTEGER
  }, {});
  Order.associate = function(models) {
    Order.hasOne(models.OrderStatus, {as: 'orderStatus', foreignKey: 'orderId'});
    Order.belongsTo(models.Product, {as: 'product'});
    Order.belongsTo(models.User, {as: 'buyer'});
    Order.belongsTo(models.Provider, {as: 'provider'});
    Order.belongsTo(models.Store, {as: 'store'});
    Order.belongsTo(models.Ordercode, {as: 'ordercode'});
    Order.hasMany(models.ServiceUser, {as: 'serviceUsers', foreignKey: 'orderId'});
    Order.hasOne(models.Payinfo, {as: 'payinfo'});
    Order.hasOne(models.CancelRequest, {as: 'cancelRequest'});
  };
  return Order;
};