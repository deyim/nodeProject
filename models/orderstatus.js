'use strict';
module.exports = (sequelize, DataTypes) => {
  var OrderStatus = sequelize.define('OrderStatus', {
    paidChk: DataTypes.BOOLEAN,
    paidDate: DataTypes.DATE,
    placeChk: DataTypes.BOOLEAN,
    placeDate: DataTypes.DATE,
    finalChk: DataTypes.BOOLEAN,
    cashChk: DataTypes.BOOLEAN,
    cancelChk: DataTypes.BOOLEAN,
    finalDate: DataTypes.DATE,
    denyChk: DataTypes.BOOLEAN,
    cancelReqChk: DataTypes.BOOLEAN
  }, {});
  OrderStatus.associate = function(models) {
    OrderStatus.belongsTo(models.Order, {as: 'order', foreignKey: 'orderId'});
  };
  return OrderStatus;
};