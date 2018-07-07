'use strict';
module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('Comment', {
    content: DataTypes.TEXT
  }, {
    paranoid: true
  });
  Comment.associate = function(models) {
    Comment.belongsTo(models.Post, {as: 'post', foreignKey: 'postId'});
    Comment.belongsTo(models.Product, {as: 'product', foreignKey: 'productId'});
    Comment.belongsTo(models.User, {as: 'author', foreignKey: 'authorId'});
    Comment.belongsTo(models.Store, {as: 'store', foreignKey: 'storeId'});
  };
  return Comment;
};