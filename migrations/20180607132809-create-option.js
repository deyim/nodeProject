'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Options', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      priceType: {
        type: Sequelize.STRING
      },
      countType: {
        type: Sequelize.STRING
      },
      start: {
        type: Sequelize.INTEGER
      },
      end: {
        type: Sequelize.INTEGER
      },
      childstart: {
        type: Sequelize.INTEGER
      },
      childend: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Options');
  }
};