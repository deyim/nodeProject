'use strict';
module.exports = (sequelize, DataTypes) => {
  var Approval = sequelize.define('Approval', {
    requestDate: DataTypes.DATE,
    deniedChk: DataTypes.BOOLEAN,
    whyDeny: DataTypes.TEXT,
    storeId: DataTypes.INTEGER,
    providerId: DataTypes.INTEGER
  }, {});
  Approval.associate = function(models) {
    // associations can be defined here
    Approval.belongsTo(models.Provider, {as: 'provider'});
    Approval.belongsTo(models.Store, {as: 'store'});
  };
  return Approval;
};