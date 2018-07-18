'use strict';
module.exports = (sequelize, DataTypes) => {
  var Visiting = sequelize.define('Visiting', {
    userId: DataTypes.INTEGER,
    device: DataTypes.STRING(1),
    visitedAt: {
      type: DataTypes.DATEONLY,
      defaultValue: new Date()
    }
  }, {});
  Visiting.associate = function(models) {
    Visiting.belongsTo(models.User, {as: 'users', foreignKey: 'userId'});
  };
  return Visiting;
};