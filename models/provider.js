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
    commission: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
  }, {
    paranoid: true,
  });
  Provider.associate = function(models) {
      Provider.belongsTo(models.User, {as: 'user'});
      Provider.hasMany(models.Store, {as: 'store', foreignKey: 'providerId'});
      Provider.hasMany(models.Board, {as: 'board'});
      Provider.hasMany(models.Approval, {as: 'approval', foreignKey: 'approvalId'});
      Provider.hasMany(models.Product, {as: 'product', foreignKey: 'providerId'});
  };
  return Provider;
};