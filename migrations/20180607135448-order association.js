'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Orders',
      'productId',
      {
        type: Sequelize.INTEGER,
            references: {
              model: 'Products',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }).then(()=>{
        queryInterface.addColumn('Orders',
        'buyerId',
        {
          type: Sequelize.INTEGER,
            references: {
              model: 'Users',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        })
      }).then(()=>{
        queryInterface.addColumn('Orders',
        'providerId',
        {
          type: Sequelize.INTEGER,
            references: {
              model: 'Providers',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        })
      }).then(()=>{
        queryInterface.addColumn('Orders',
        'ordercodeId',
        {
          type: Sequelize.INTEGER,
            references: {
              model: 'Ordercodes',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        })
      }).then(()=>{
        queryInterface.addColumn('Orders',
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
        queryInterface.addColumn('ServiceUsers',
        'orderId',
        {
          type: Sequelize.INTEGER,
            references: {
              model: 'Orders',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        })
      }).then(()=>{
        queryInterface.addColumn('Payinfos',
        'orderId',
        {
          type: Sequelize.INTEGER,
            references: {
              model: 'Orders',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        })
      }).then(()=>{
        queryInterface.addColumn('OrderStatuses',
        'orderId',
        {
          type: Sequelize.INTEGER,
            references: {
              model: 'Orders',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        })
      }).then(()=>{
        queryInterface.addColumn('CancelRequests',
        'orderId',
        {
          type: Sequelize.INTEGER,
            references: {
              model: 'Orders',
              key: 'id'
            },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        })
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Orders','productId')
    .then(()=>{
      queryInterface.removeColumn('Orders','buyerId');
    })
    .then(()=>{
      queryInterface.removeColumn('Orders','providerId');
    })
    .then(()=>{
      queryInterface.removeColumn('Orders','ordercodeId');
    })
    .then(()=>{
      queryInterface.removeColumn('Orders','storeId');
    })
    .then(()=>{
      queryInterface.removeColumn('ServiceUsers','orderId');
    })
    .then(()=>{
      queryInterface.removeColumn('CancelRequests','orderId');
    })
    .then(()=>{
      queryInterface.removeColumn('OrderStatuses','orderId');
    })
    .then(()=>{
      queryInterface.removeColumn('Payinfos','orderId');
    })
  }
};
