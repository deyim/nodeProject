'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tag = sequelize.define('Tag', {
    tag: {
      type: DataTypes.STRING(20),
      allowNull:false
    }
  },{});
  Tag.associate = function(models) {
    Tag.belongsToMany(models.Product, {
      through: 'ProductTags',
      as: 'products',
      foreignKey: 'tagId'
    });
  };
  return Tag;
};
