'use strict';
module.exports = (sequelize, DataTypes) => {
  var AdAffiliation = sequelize.define('AdAffiliation', {
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
  AdAffiliation.associate = function(models) {
    // associations can be defined here
  };
  return AdAffiliation;
};