'use strict';
module.exports = (sequelize, DataTypes) => {
  var Notice = sequelize.define('Notice', {
    title: {
      type: DataTypes.STRING(30),
    },
    content: DataTypes.TEXT,
    type: DataTypes.STRING(1)
  }, {});
  Notice.associate = function(models) {
    Notice.belongsTo(models.Noticecode, {as:'noticecode', foreignKey: 'noticecodeId'});
  };
  return Notice;
};