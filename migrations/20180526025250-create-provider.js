'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Providers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      companyName: {
        type: Sequelize.STRING,
        unique: true
      },
      companyNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      companyType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      CEO: {
        type: Sequelize.STRING,
        allowNull: false
      },
      corporateNumber: {
        type: Sequelize.STRING
      },
      businessType: {
        type: Sequelize.STRING
      },
      businessCategory: {
        type: Sequelize.STRING
      },
      commuNumber: {
        type: Sequelize.STRING
      },
      CEONumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      faxNumber: {
        type: Sequelize.STRING
      },
      staffName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      staffNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      accountName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      accountBank: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rateType: {
        type: Sequelize.STRING,
      },
      monthFee: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      commission: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt:{
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Providers');
  }
};