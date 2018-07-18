'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Orders', 'withdrawnChk',{
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
    .then(()=>{
      queryInterface.addColumn('Orders', 'withdrawlId',{
        type: Sequelize.INTEGER,
        references: {
          model: 'Withdrawls', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Orders', 'withdrawnChk')
    .then(()=>{
      queryInterface.removeColumn('Orders', 'withdrawlId')
    })
  }
};
