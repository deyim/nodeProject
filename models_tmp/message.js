'use strict';
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};