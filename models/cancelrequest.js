'use strict';
module.exports = (sequelize, DataTypes) => {
  var CancelRequest = sequelize.define('CancelRequest', {
    cancelReason: DataTypes.TEXT,
    denyReason: DataTypes.TEXT
  }, {});
  CancelRequest.associate = function(models) {
    CancelRequest.belongsTo(models.Order, {as: 'order', foreignKey: 'orderId'});
  };
  return CancelRequest;
};