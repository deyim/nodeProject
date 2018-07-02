'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('StoreUsers', 
      'visitCnt', 
      {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    ).then(()=>{
      queryInterface.addColumn('StoreUsers', 
      'visitDate', 
      {
        type: Sequelize.DATE
      }
      );
    }).then(()=>{
      queryInterface.addColumn('StoreUsers', 
      'orderCnt', 
      {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('StoreUsers', 
      'visitCnt', 
    ).then(()=>{
      queryInterface.removeColumn('StoreUsers', 
      'visitDate', 
      );
    }).then(()=>{
      queryInterface.removeColumn('StoreUsers', 
      'orderCnt',
      );
    });
  }
};
