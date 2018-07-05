'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Providers', 'commission')
    .then(()=>{
      queryInterface.addColumn('Providers', 'monthRate', 
        {
          type: Sequelize.FLOAT,
          defaultValue: 0
        }
      )
    }).then(()=>{
      queryInterface.addColumn('Providers', 'frCompanyName',
      {
        type: Sequelize.STRING(30)
      })
    }).then(()=>{
      queryInterface.addColumn('Providers', 'frNation',
      {
        type: Sequelize.STRING(30)
      })
    }).then(()=>{
      queryInterface.addColumn('Providers', 'frCity',
      {
        type: Sequelize.STRING(30)
      })
    }).then(()=>{
      queryInterface.addColumn('Providers', 'frPhone',
      {
        type: Sequelize.STRING(30)
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Providers', 'commission')
    .then(()=>{
      queryInterface.removeColumn('Providers', 'monthRate')
    }).then(()=>{
      queryInterface.removeColumn('Providers', 'frCompanyName')
    }).then(()=>{
      queryInterface.removeColumn('Providers', 'frNation');
    }).then(()=>{
      queryInterface.removeColumn('Providers', 'frCity');
    }).then(()=>{
      queryInterface.removeColumn('Providers', 'frPhone');
    })
  }
};
