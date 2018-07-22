'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('OrderStatuses', 'finalDate', {
      type:Sequelize.DATE
    })
    .then(()=>{
      queryInterface.addColumn('OrderStatuses', 'denyChk', {
        type:Sequelize.BOOLEAN
      })
    })
    .then(()=>{
      queryInterface.addColumn('OrderStatuses', 'cancelReqChk', {
        type:Sequelize.BOOLEAN
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('OrderStatuses','finalDate')
    .then(()=>{queryInterface.removeColumn('OrderStatuses','denyChk')})
    .then(()=>{queryInterface.removeColumn('OrderStatuses','cancelReqChk')})
  }
};
