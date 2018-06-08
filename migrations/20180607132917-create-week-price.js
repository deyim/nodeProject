'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('WeekPrices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mon: {
        type: Sequelize.FLOAT
      },
      tue: {
        type: Sequelize.FLOAT
      },
      wed: {
        type: Sequelize.FLOAT
      },
      thu: {
        type: Sequelize.FLOAT
      },
      fri: {
        type: Sequelize.FLOAT
      },
      sat: {
        type: Sequelize.FLOAT
      },
      sun: {
        type: Sequelize.FLOAT
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
    return queryInterface.dropTable('WeekPrices');
  }
};