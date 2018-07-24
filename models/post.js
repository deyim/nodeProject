'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING(50)
    },
    content: DataTypes.TEXT,
    attachedPath: DataTypes.STRING,
    noticeChk: DataTypes.BOOLEAN
  }, {
    paranoid: true
  });
  Post.associate = function(models) {
    Post.belongsTo(models.User, {as: 'author', foreignKey: 'authorId'});
    Post.belongsTo(models.Store, {as: 'store', foreignKey: 'storeId'});
    Post.belongsTo(models.Board, {as: 'board'});
    Post.hasMany(models.Comment, {as: 'comments', foreignKey: 'postId'});
    Post.hasMany(models.AttachedFile, {as:'attachedFiles', foreignKey: 'postId'});
  };
  return Post;
};