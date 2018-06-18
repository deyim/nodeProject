'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.dropTable('Commenta');
  },

  down: (queryInterface, Sequelize) => {
    ;
  }
};
