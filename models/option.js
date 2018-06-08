'use strict';
module.exports = (sequelize, DataTypes) => {
  var Option = sequelize.define('Option', {
    title: DataTypes.STRING,
    priceType: DataTypes.STRING,
    countType: DataTypes.STRING,
    start: DataTypes.INTEGER,
    end: DataTypes.INTEGER,
    childstart: DataTypes.INTEGER,
    childend: DataTypes.INTEGER
  }, {});
  Option.associate = function(models) {
    // associations can be defined here
  };
  return Option;
};