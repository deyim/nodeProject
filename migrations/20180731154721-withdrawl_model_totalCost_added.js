'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Withdrawls', 'totalCost', 
    {
      type: Sequelize.INTEGER
    })
    .then(()=>{
      queryInterface.addColumn('Withdrawls', 'storeId', 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Stores', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      })
    })
    .then(()=>{
      queryInterface.addColumn('Withdrawls', 'requestedDate', 
      {
        type: Sequelize.DATE
      })
    })
    .then(()=>{
      queryInterface.addColumn('Withdrawls', 'withdrawnDate', 
      {
        type: Sequelize.DATE
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Withdrawls', 'totalCost')
    .then(()=>{
      queryInterface.removeColumn('Withdrawls', 'storeId');
    })
    .then(()=>{
      queryInterface.removeColumn('Withdrawls', 'requestedDate');
    })
    .then(()=>{
      queryInterface.removeColumn('Withdrawls', 'withdrawnDate');
    })
  }
};
