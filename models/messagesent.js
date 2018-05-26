'use strict';
module.exports = (sequelize, DataTypes) => {
  var MessageSent = sequelize.define('MessageSent', {
    receiverDel: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    senderDel: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ifRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  MessageSent.associate = function(models) {
    // associations can be defined here
  };
  return MessageSent;
};