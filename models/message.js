'use strict';
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    paranoid: true
  });
  Message.associate = function(models) {
    Message.hasOne(Sentmessage, {as: 'sentMessage', foreignKey: 'messageId'});
  };
  return Message;
};