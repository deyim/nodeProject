'use strict';
module.exports = (sequelize, DataTypes) => {
  var AttachedFile = sequelize.define('AttachedFile', {
    postId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    filePath: DataTypes.STRING
  }, {});
  AttachedFile.associate = function(models) {
    // associations can be defined here
    AttachedFile.belongsTo(models.Product, {as:"attachedFile", foreginKey:'productId'})
    AttachedFile.belongsTo(models.Post,  {as:"attachedFile", foreginKey:'postId'})
  };
  return AttachedFile;
};