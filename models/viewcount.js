'use strict';
module.exports = (sequelize, DataTypes) => {
  var Viewcount = sequelize.define('Viewcount', {
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    viewedAt: {
      type: DataTypes.DATEONLY,
      defaultValue: new Date()
    }
  }, {});
  Viewcount.associate = function(models) {
    Viewcount.belongsTo(models.User, {as: 'user', foreignKey: 'userId'});
    Viewcount.belongsTo(models.Product, {as: 'product', foreignKey: 'productId'});
  };
  return Viewcount;
};