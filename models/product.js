'use strict';
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: DataTypes.TEXT,
    startdate: DataTypes.DATE,
    enddate: DataTypes.DATE,
    onSaleChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    onDisplayChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    periodType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imagePath: DataTypes.STRING,
    policy: DataTypes.TEXT
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};