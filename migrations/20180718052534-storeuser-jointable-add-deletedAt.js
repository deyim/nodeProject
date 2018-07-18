'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('StoreUsers', 'deletedAt',
  {
    type: Sequelize.DATE
  })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('StoreUsers', 'deletedAt');
  }
};
