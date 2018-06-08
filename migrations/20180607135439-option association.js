'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Options',
      'providerId',
      {
        type: Sequelize.INTEGER,
            references: {
              model: 'Providers',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }).then(()=>{
        queryInterface.addColumn('Options',
        'storeId',
        {
          type: Sequelize.INTEGER,
            references: {
              model: 'Stores',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        })
      }).then(()=>{
        queryInterface.addColumn('Options',
        'productId',
        {
          type: Sequelize.INTEGER,
            references: {
              model: 'Products',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        })
      }).then(()=>{
        queryInterface.addColumn('WeekPrices',
        'optionId',
        {
          type: Sequelize.INTEGER,
            references: {
              model: 'Options',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        })
      }).then(()=>{
        queryInterface.addColumn('DatePrices',
        'optionId',
        {
          type: Sequelize.INTEGER,
            references: {
              model: 'Options',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        })
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Options','providerId')
    .then(()=>{
      queryInterface.removeColumn('Options','storeId');
    })
    .then(()=>{
      queryInterface.removeColumn('Options','productId');
    })
    .then(()=>{
      queryInterface.removeColumn('WeekPrices','optionId');
    })
    .then(()=>{
      queryInterface.removeColumn('DatePrices','optionId');
    })
  }
};
