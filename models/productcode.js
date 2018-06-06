'use strict';
module.exports = (sequelize, DataTypes) => {
  var Productcode = sequelize.define('Productcode', {
    categoryName: DataTypes.INTEGER,
    code: DataTypes.STRING(8),
    usedChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Productcode.associate = function(models) {
  };
  return Productcode;
};