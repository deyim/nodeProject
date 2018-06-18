'use strict';
module.exports = (sequelize, DataTypes) => {
  var Noticecode = sequelize.define('Noticecode', {
    code: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW 
    }
  }, {
    timestamps: false
  });
  Noticecode.associate = function(models) {
    Noticecode.hasMany(models.Notice, {as: 'notices', foreignKey: 'noticecodeId', onDelete:'cascade'});
  };
  return Noticecode;
};