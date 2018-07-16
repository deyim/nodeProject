'use strict';
module.exports = (sequelize, DataTypes) => {
  var Store = sequelize.define('Store', {
    url: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(20),
      unique: true,
    },
    introduction: {
      type: DataTypes.STRING(100)
    },
    memberCnt: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    staffName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    staffNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    accountNumber: {
      type: DataTypes.STRING(20),
    },
    rateType: {
      type: DataTypes.STRING(2)
    },
    monthFee: {
      type: DataTypes.INTEGER,
    },
    comission: {
      type: DataTypes.FLOAT,
    },
    storeLogoPath: {
      type: DataTypes.STRING(100),
    },
    storeImgPath:{
      type: DataTypes.STRING(100)
    },
    approvalChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    approvalDate: {
      type: DataTypes.DATE
    }
  }, {
    paranoid: true,
  });
  Store.associate = function(models) {
    Store.hasOne(models.Categoryfill, {as: 'category'});
    Store.hasOne(models.Market, {as: 'market'});
    Store.hasMany(models.Board, {as: 'boards'});
    Store.hasMany(models.StoreFile, {as: 'storeFiles', foreignKey: 'storeId'});
    Store.hasMany(models.Product, {as: 'products', foreignKey: 'storeId'});
    Store.belongsTo(models.Provider, {as: 'provider', foreignKey: 'providerId'});
    Store.hasOne(models.Approval, {as: 'approval', foreignKey: 'storeId'});
    Store.belongsToMany(models.User, {
      through: 'StoreUsers',
      as: 'users',
      foreignKey: 'storeId'
    });
    Store.hasMany(models.Post, {as: 'posts', foreignKey: 'storeId'});
    //nation, city
    Store.belongsToMany(models.Nation, {
      through: 'StoreNations',
      as: 'nations',
      foreignKey: 'storeId'
    });
    Store.belongsToMany(models.City, {
      through: 'StoreCities',
      as: 'cities',
      foreignKey: 'storeId'
    });
    
  };
  return Store;
};