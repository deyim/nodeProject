'use strict';
module.exports = (sequelize, DataTypes) => {
  var Payinfo = sequelize.define('Payinfo', {
    measure: DataTypes.STRING,
    pgCompany: DataTypes.STRING,
    pgRate: DataTypes.FLOAT
  }, {});
  Payinfo.associate = function(models) {
    // associations can be defined here
  };
  return Payinfo;
};