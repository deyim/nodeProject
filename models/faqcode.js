'use strict';
module.exports = (sequelize, DataTypes) => {
  var FAQcode = sequelize.define('FAQcode', {
    code: DataTypes.STRING
  }, {});
  FAQcode.associate = function(models) {
    // associations can be defined here
  };
  return FAQcode;
};