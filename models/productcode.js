'use strict';
module.exports = (sequelize, DataTypes) => {
  var Productcode = sequelize.define('Productcode', {
    categoryId: DataTypes.INTEGER,
    code: DataTypes.STRING(8),
    usedChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW 
    }
  }, {
    timestamps:false
  });
  Productcode.associate = function(models) {
  };
  return Productcode;
};