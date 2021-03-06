'use strict';
module.exports = (sequelize, DataTypes) => {
  var Provider = sequelize.define('Provider', {
    companyName: {
      type: DataTypes.STRING,
      unique: true
    },
    companyNumber:{
      type: DataTypes.STRING,
      unique: true
    },
    companyType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CEO: {
      type: DataTypes.STRING,
      allowNull: false
    },
    corporateNumber: DataTypes.STRING,
    businessType: DataTypes.STRING,
    businessCategory: DataTypes.STRING,
    commuNumber: DataTypes.STRING,
    CEONumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    faxNumber: DataTypes.STRING,
    staffName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    staffNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountBank: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rateType: {
      type: DataTypes.STRING
    },
    monthFee: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    monthRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    frCompanyName: {
      type: DataTypes.STRING(30)
    },
    frNation: {
      type: DataTypes.STRING(30)
    },
    frCity: {
      type: DataTypes.STRING(30)
    },
    frPhone: {
      type: DataTypes.STRING(30)
    }

  }, {
    paranoid: true,
  });
  Provider.associate = function(models) {
      Provider.belongsTo(models.User, {as: 'user', foreignKey: 'userId'});
      Provider.hasOne(models.Store, {as: 'store', foreignKey: 'providerId'});
      // Provider.hasMany(models.Board, {as: 'boards'});
      Provider.hasMany(models.Approval, {as: 'approvals', foreignKey: 'providerId'});
      Provider.hasMany(models.Product, {as: 'products', foreignKey: 'providerId'});
      Provider.hasMany(models.Withdrawl, {as: 'withdrawls', foreignKey: 'providerId'});

  };
  return Provider;
};