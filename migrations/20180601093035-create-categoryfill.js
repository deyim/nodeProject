'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Categoryfills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hotel: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      car: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      activity: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      tour: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      massage: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      ticket: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      flight: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      general: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      etc: {
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
    return queryInterface.dropTable('Categoryfills');
  }
};