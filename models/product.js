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
  }, 
  {
    paranoid: true,
  });
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsTo(db.Provider, {as: 'provider'});
    Product.belongsTo(db.Store, {as: 'store'});
    Product.belongsTo(db.Category, {as: 'category'});
    Product.belongsTo(db.Productcode, {as:'productcode'});
    //city, nation, tag
    
  };
  return Product;
};