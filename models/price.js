'use strict';
module.exports = (sequelize, DataTypes) => {
  var Price = sequelize.define('Price', {
    ifChild: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    start: DataTypes.INTEGER,
    end: DataTypes.INTEGER
  }, {});
  Price.associate = function(models) {
    Price.belongsTo(models.Option, {as: 'option'});
    Price.belongsTo(models.Product, {as: 'product'});
  };
  return Price;
};