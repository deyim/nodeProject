'use strict';
module.exports = (sequelize, DataTypes) => {
  var City = sequelize.define('City', {
    city: {
      type: DataTypes.STRING(20),
      allowNull:false
    }
  }, {});
  City.associate = function(models) {
    // associations can be defined here
  };
  return City;
};