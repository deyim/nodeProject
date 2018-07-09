'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Orders','storeCost',
    {
      type: Sequelize.INTEGER
    }).then(()=>{
      queryInterface.addColumn('Orders', 'pgCost', 
      {
        type: Sequelize.INTEGER
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Orders','storeCost').then(()=>{
      queryInterface.removeColumn('Orders', 'storeCost');
    })
  }
};
