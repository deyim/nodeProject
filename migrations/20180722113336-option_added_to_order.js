'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Orders', 'optionId', {
      type: Sequelize.INTEGER,
        references: {
          model: 'Options', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Orders', 'optionId');
  }
};
