'use strict';
module.exports = (sequelize, DataTypes) => {
  var Nation = sequelize.define('Nation', {
    nation: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {});
  Nation.associate = function(models) {
    // associations can be defined here
  };
  return Nation;
};