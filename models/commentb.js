'use strict';
module.exports = (sequelize, DataTypes) => {
  var Commentb = sequelize.define('Commentb', {
    content: DataTypes.TEXT
  }, {
    paranoid: true
  });
  Commentb.associate = function(models) {
    Commentb.belongsTo(models.Product, {as: 'product'});
    Commentb.belongsTo(models.User, {as: 'author', foreignKey: 'authorId'});
  };
  return Commentb;
};