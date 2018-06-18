'use strict';
module.exports = (sequelize, DataTypes) => {
  var Notice = sequelize.define('Notice', {
    title: {
      type: DataTypes.STRING(30),
    },
    content: DataTypes.TEXT,
    type: DataTypes.STRING(1),
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW 
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW 
    }
  }, {});
  Notice.associate = function(models) {
    Notice.belongsTo(models.Noticecode, {as:'noticecode', foreignKey: 'noticecodeId'});
  };
  return Notice;
};