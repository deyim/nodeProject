'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn('OrderStatuses',
      'placeChk',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    ).then(()=>{
      queryInterface.changeColumn('OrderStatuses',
        'finalChk',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      )
    }).then(()=>{
      queryInterface.changeColumn('OrderStatuses',
        'cancelChk',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      )
    }).then(()=>{
      queryInterface.changeColumn('OrderStatuses',
      'cashChk',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    )
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
