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
        type: Sequelize.STRING(30),
        unique: true
      },
      companyNumber: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      companyType: {
        type: Sequelize.STRING(3),
        allowNull: false
      },
      CEO: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      corporateNumber: {
        type: Sequelize.STRING(50)
      },
      businessType: {
        type: Sequelize.STRING(50)
      },
      businessCategory: {
        type: Sequelize.STRING(50)
      },
      commuNumber: {
        type: Sequelize.STRING(50)
      },
      CEONumber: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      faxNumber: {
        type: Sequelize.STRING(20)
      },
      staffName: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      staffNumber: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      accountNumber: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      accountName: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      accountBank: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      rateType: {
        type: Sequelize.STRING(1),
        allowNull: false
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
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Providers');
  }
};