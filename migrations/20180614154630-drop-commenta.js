'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Commenta');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Commenta');
  }
};
