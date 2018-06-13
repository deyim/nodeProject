'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Nations','createdAt')
    .then(()=>{
      queryInterface.removeColumn('Nations','updatedAt');
    })
    .then(()=>{
      queryInterface.removeColumn('Cities','createdAt');
    })
    .then(()=>{
      queryInterface.removeColumn('Cities','updatedAt');
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Nations','createdAt',{
      type: Sequelize.DATE
    })
    .then(()=>{
      queryInterface.addColumn('Nations','updatedAt', {
        type: Sequelize.DATE
      });
    })
    .then(()=>{
      queryInterface.addColumn('Cities','createdAt', {
        type: Sequelize.DATE
      });
    })
    .then(()=>{
      queryInterface.addColumn('Cities','updatedAt', {
        type: Sequelize.DATE
      });
    })
  }
};
