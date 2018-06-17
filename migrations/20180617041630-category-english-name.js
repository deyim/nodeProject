'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Categories',
    'engName',
    {
      type: Sequelize.STRING(1)
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Categories','engName');
  }
};
