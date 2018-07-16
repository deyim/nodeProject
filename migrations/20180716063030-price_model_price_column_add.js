'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Prices', 'price',
    {
      type: Sequelize.INTEGER,
    }
  )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Prices', 'price');
  }
};
