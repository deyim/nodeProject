'use strict';
module.exports = (sequelize, DataTypes) => {
  var DefaultCategory = sequelize.define('DefaultCategory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(1),
      allowNull: false
    }
  }, {});
  DefaultCategory.associate = function(models) {
    // associations can be defined here
  };
  return DefaultCategory;
};