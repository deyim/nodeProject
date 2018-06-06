'use strict';
module.exports = (sequelize, DataTypes) => {
  var AdStory = sequelize.define('AdStory', {
    title: {
      type: DataTypes.STRING(30)
    },
    imgPath: {
      type: DataTypes.STRING(150)
    },
    imgUrl: {
      type: DataTypes.STRING(150)
    },
    onDisplayChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    connectUrl: {
      type: DataTypes.STRING(150)
    }
  }, {
    paranoid: true
  });
  AdStory.associate = function(models) {
    // associations can be defined here
  };
  return AdStory;
};