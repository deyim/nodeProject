'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING(50)
    },
    content: DataTypes.TEXT,
    attachedPath: DataTypes.STRING
  }, {
    paranoid: true
  });
  Post.associate = function(models) {
    Post.belongsTo(models.User, {as: 'author', foreignKey: 'authorId'});
    Post.belongsTo(models.Store, {as: 'store'});
    Post.belongsTo(models.Board, {as: 'board'});
  };
  return Post;
};