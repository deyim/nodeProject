'use strict';
module.exports = (sequelize, DataTypes) => {
  var Provider = sequelize.define('Provider', {
    companyName: {
      type: DataTypes.STRING(30),
      unique: true
    },
    companyNumber:{
      type: DataTypes.STRING(50),
      unique: true
    },
    companyType: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    CEO: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    corporateNumber: DataTypes.STRING(50),
    businessType: DataTypes.STRING(50),
    businessCategory: DataTypes.STRING(50),
    commuNumber: DataTypes.STRING(50),
    CEONumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    faxNumber: DataTypes.STRING(20),
    staffName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    staffNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    accountNumber: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    accountName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    accountBank: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    rateType: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    monthFee: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    commission: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
  }, {});
  Provider.associate = function(models) {
    // associations can be defined here
  };
  return Provider;
};