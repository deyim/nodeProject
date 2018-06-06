'use strict';
module.exports = (sequelize, DataTypes) => {
  var Notice = sequelize.define('Notice', {
    title: {
      type: DataTypes.STRING(30),
    },
    content: DataTypes.TEXT
  }, {});
  Notice.associate = function(models) {
    // associations can be defined here
  };
  return Notice;
};