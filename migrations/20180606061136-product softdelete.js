'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Products',
      'deletedAt',
      {
        type: Sequelize.DATE
      }
    )
    
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Products',
      'deletedAt'
    )
  }
};
