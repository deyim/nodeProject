'use strict';
module.exports = (sequelize, DataTypes) => {
  var Categoryfill = sequelize.define('Categoryfill', {
    hotel: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    car: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    activity: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tour: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    massage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ticket: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    flight: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    general: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    etc: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Categoryfill.associate = function(models) {
    // associations can be defined here
  };
  return Categoryfill;
};