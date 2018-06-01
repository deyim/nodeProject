'use strict';
module.exports = (sequelize, DataTypes) => {
  var Sentmessage = sequelize.define('Sentmessage', {
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
  }, {
    paranoid: true
  });
  Sentmessage.associate = function(models) {
    Sentmessage.belongsTo(Message, {as: "message", foreignKey: 'messageId'});
    Sentmessage.belongsTo(User, {as: "sender", foreignKey: 'senderId'});
    Sentmessage.belongsTo(User, {as: "receiver", foreignKey: 'receiverId'});
  };
  return Sentmessage;
};