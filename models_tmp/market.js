'use strict';
module.exports = (sequelize, DataTypes) => {
  var Market = sequelize.define('Market', {
    title: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    introduction: DataTypes.STRING(50)
  }, {});
  Market.associate = function(models) {
    Market.belongsTo(models.Store);
  };
  return Market;
};