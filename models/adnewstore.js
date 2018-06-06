'use strict';
module.exports = (sequelize, DataTypes) => {
  var AdNewstore = sequelize.define('AdNewstore', {
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
  }, {
    paranoid: true
  });
  AdNewstore.associate = function(models) {
    // associations can be defined here
  };
  return AdNewstore;
};