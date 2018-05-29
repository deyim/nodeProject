'use strict';
module.exports = (sequelize, DataTypes) => {
  var Board = sequelize.define('Board', {
    title: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    introduction: DataTypes.STRING(50)
  }, {});
  Board.associate = function(models) {
    // associations can be defined here
  };
  return Board;
};