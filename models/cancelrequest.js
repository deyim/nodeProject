'use strict';
module.exports = (sequelize, DataTypes) => {
  var CancelRequest = sequelize.define('CancelRequest', {
    cancelReason: DataTypes.TEXT,
    denyReason: DataTypes.TEXT
  }, {});
  CancelRequest.associate = function(models) {
    // associations can be defined here
  };
  return CancelRequest;
};