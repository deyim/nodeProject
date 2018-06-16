'use strict';
module.exports = (sequelize, DataTypes) => {
  var ServiceUser = sequelize.define('ServiceUser', {
    korName: DataTypes.STRING,
    engName: DataTypes.STRING,
    birthday: DataTypes.STRING,
    korPhone: DataTypes.STRING,
    tourPhone: DataTypes.STRING,
    kakao: DataTypes.STRING
  }, {});
  ServiceUser.associate = function(models) {
    // associations can be defined here
    ServiceUser.belongsTo(models.Order, {as:'order', foreignKey: 'orderId'});
  };
  return ServiceUser;
};