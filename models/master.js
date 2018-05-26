'use strict';
module.exports = (sequelize, DataTypes) => {
  var Master = sequelize.define('Master', {
    name: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false
    },
    authority: {
      type: DataTypes.STRING(1),
      defaultValue: 'A'
    }
  }, {});
  Master.associate = function(models) {
    // associations can be defined here
  };
  return Master;
};