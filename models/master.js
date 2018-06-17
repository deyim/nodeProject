'use strict';
module.exports = (sequelize, DataTypes) => {
  var Master = sequelize.define('Master', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    authority: {
      type: DataTypes.STRING,
      defaultValue: 'A'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    paranoid:true
  });
  Master.associate = function(models) {
    Master.belongsTo(models.User, {as: 'user'});
  };
  return Master;
};