'use strict';
module.exports = (sequelize, DataTypes) => {
  var Price = sequelize.define('Price', {
    ifChild: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    start: DataTypes.INTEGER,
    end: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {});
  Price.associate = function(models) {
    Price.belongsTo(models.Option, {as: 'option', foreignKey: 'optionId'});
    Price.belongsTo(models.Product, {as: 'product',  foreignKey: 'productId'});
  };
  return Price;
};