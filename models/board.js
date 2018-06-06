'use strict';
module.exports = (sequelize, DataTypes) => {
  var Board = sequelize.define('Board', {
    title: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    introduction: DataTypes.STRING(100)
  }, {
    paranoid: true,    
  });
  Board.associate = function(models) {
     Board.belongsTo(models.Store, {as: 'store'});
     Board.belongsTo(models.Provider, {as: 'provider'});
     Board.hasMany(models.Post, {as: 'posts'});
  };
  return Board;
};