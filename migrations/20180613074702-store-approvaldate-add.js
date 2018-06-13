'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Stores',
    'approvalDate',
    {
      type:Sequelize.DATE
    }
  )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Stores', 'approvalDate');
  }
};
