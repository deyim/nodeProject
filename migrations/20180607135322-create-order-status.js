'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('OrderStatuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      paidChk: {
        type: Sequelize.BOOLEAN
      },
      paidDate: {
        type: Sequelize.DATE
      },
      placeChk: {
        type: Sequelize.BOOLEAN
      },
      placeDate: {
        type: Sequelize.DATE
      },
      finalChk: {
        type: Sequelize.BOOLEAN
      },
      cashChk: {
        type: Sequelize.BOOLEAN
      },
      cancelChk: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('OrderStatuses');
  }
};