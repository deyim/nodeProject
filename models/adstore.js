'use strict';
module.exports = (sequelize, DataTypes) => {
  var AdStore = sequelize.define('AdStore', {
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
  AdStore.associate = function(models) {
    // associations can be defined here
  };
  return AdStore;
};