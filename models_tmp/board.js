'use strict';
module.exports = (sequelize, DataTypes) => {
  var Board = sequelize.define('Board', {
    title: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    introduction: DataTypes.STRING(50)
  }, {
    paranoid: true,    
  });
  Board.associate = function(models) {
     Board.belongsTo(models.Store);
  };
  return Board;
};