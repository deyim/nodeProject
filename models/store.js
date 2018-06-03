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
    }
  }, {
    paranoid: true,
  });
  Store.associate = function(models) {
    Store.hasOne(models.Categoryfill, {as: 'category'});
    Store.hasOne(models.Market, {as: 'market'});
    Store.hasMany(models.Board, {as: 'board'});
    Store.belongsTo(models.Provider, {as: 'provider', foreignKey: 'providerId'});
  };
  return Store;
};