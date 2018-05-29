'use strict';
module.exports = (sequelize, DataTypes) => {
  var Market = sequelize.define('Market', {
    title: DataTypes.STRING,
    introduction: DataTypes.STRING
  }, {});
  Market.associate = function(models) {
    // associations can be defined here
  };
  return Market;
};