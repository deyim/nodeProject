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
    Sentmessage.belongsTo(models.Message, {as: "message", foreignKey: 'messageId'});
    Sentmessage.belongsTo(models.User, {as: "sender", foreignKey: 'senderId'});
    Sentmessage.belongsTo(models.User, {as: "receiver", foreignKey: 'receiverId'});
  };
  return Sentmessage;
};