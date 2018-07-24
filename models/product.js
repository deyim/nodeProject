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
    Product.hasMany(models.Comment, {as: 'comments', foreignKey: 'productId'});
    Product.hasMany(models.Price, {as: 'prices', foreignKey: 'productId'});
    Product.hasMany(models.Option, {as: 'options', foreignKey: 'productId'});
    Product.hasMany(models.Viewcount, {as:'viewcounts', foreignKey: 'productId'});
    Product.hasMany(models.AttachedFile, {as:'attachedFiles', foreignKey: 'productId'});
    //city, nation, tag
    Product.belongsToMany(models.Nation, {
      through: 'ProductNations',
      as: 'nations',
      foreignKey: 'productId'
    });
    Product.belongsToMany(models.City, {
      through: 'ProductCities',
      as: 'cities',
      foreignKey: 'productId'
    });
    Product.belongsToMany(models.Tag, {
      through: 'ProductTags',
      as: 'tags',
      foreignKey: 'productId'
    });
    
  };
  return Product;
};