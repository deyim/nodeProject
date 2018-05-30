'use strict';
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return ( 
      queryInterface.addColumn('Categoryfills', 'StoreId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Stores', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      })
      .then(()=>{
          queryInterface.addColumn('Markets', 'StoreId',{
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
        queryInterface.addColumn('Boards', 'StoreId',{
          type: Sequelize.INTEGER,
          references: {
            model: 'Stores', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        })
      })
    )
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('Categoryfills', 'StoreId')
      .then(()=>{
        queryInterface.removeColumn('Markets', 'StoreId')
      })
      .then(()=>{
        queryInterface.removeColumn('Boards', 'StoreId')
      })
    ];
  }
};
