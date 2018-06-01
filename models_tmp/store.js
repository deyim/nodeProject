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
      type: DataTypes.STRING(50)
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
      type: DataTypes.STRING(20)
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
    //store representative image
    //multer -> images store
    approvalChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    paranoid: true,
  });
  Store.associate = function(models) {
    Store.hasOne(models.Categoryfill, {as: Category});
    Store.hasOne(models.Market);
    Store.hasMany(models.Board);
  };
  return Store;
};