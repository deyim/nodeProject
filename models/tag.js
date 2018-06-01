'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tag = sequelize.define('Tag', {
    tag: {
      type: DataTypes.STRING(20),
      allowNull:false
    }
  },{});
  Tag.associate = function(models) {
    // associations can be defined here
  };
  return Tag;
};
