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
    // associations can be defined here
  };
  return Post;
};