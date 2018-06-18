'use strict';
module.exports = (sequelize, DataTypes) => {
  var Commenta = sequelize.define('Commenta', {
    content: DataTypes.TEXT
  }, {
    paranoid: true
  });
  Commenta.associate = function(models) {
    Commenta.belongsTo(models.Post, {as: 'post', foreignKey: 'postId'});
    Commenta.belongsTo(models.User, {as: 'author', foreignKey: 'authorId'});
  };
  return Commenta;
};