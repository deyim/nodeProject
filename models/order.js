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
    Order.hasOne(models.OrderStatus, {as: 'order'});
  };
  return Order;
};