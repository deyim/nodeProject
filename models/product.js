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
    Product.belongsTo(models.Provider, {as: 'provider', foreignKey: 'providerId'});
    Product.belongsTo(models.Store, {as: 'store', foreignKey: 'storeId'});
    Product.belongsTo(models.Category, {as: 'category', foreignKey: 'categoryId'});
    Product.belongsTo(models.Productcode, {as:'productcode', foreignKey: 'productcodeId'});
    Product.hasMany(models.Commentb, {as: 'comments'});
    //city, nation, tag
    
  };
  return Product;
};