'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Products',
      'providerId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Providers', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    ).then(()=>{
      queryInterface.addColumn(
        'Products',
        'storeId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Stores', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      );
    }).then(()=>{
      queryInterface.addColumn(
        'Products',
        'categoryId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Categories', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      );
    }).then(()=>{
      queryInterface.addColumn(
        'Products',
        'productcodeId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Productcodes', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      );
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Products','providerId')
    .then(()=>{
      queryInterface.removeColumn('Products','storeId');
    })
    .then(()=>{
      queryInterface.removeColumn('Products','categoryId');
    })
    .then(()=>{
      queryInterface.removeColumn('Products','productcodeId');
    })
  }
};
