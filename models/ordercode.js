'use strict';
module.exports = (sequelize, DataTypes) => {
  var Ordercode = sequelize.define('Ordercode', {
    code: DataTypes.STRING(8),
    usedChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Ordercode.associate = function(models) {
    // associations can be defined here
  };
  return Ordercode;
};