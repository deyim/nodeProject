'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Stores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(20),
        unique: true
      },
      introduction: {
        type: Sequelize.STRING(100)
      },
      memberCnt: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      staffName: {
        type: Sequelize.STRING(20)
      },
      staffNumber: {
        type: Sequelize.STRING(20)
      },
      accountNumber: {
        type: Sequelize.STRING(20)
      },
      rateType: {
        type: Sequelize.STRING(2)
      },
      monthFee: {
        type: Sequelize.INTEGER
      },
      comission: {
        type: Sequelize.FLOAT
      },
      storeLogoPath: {
        type: Sequelize.STRING(100)
      },
      storeImgPath:{
        type: Sequelize.STRING(100)
      },
      approvalChk: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Stores');
  }
};