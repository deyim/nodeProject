'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Comments',
      'authorId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    ).then(()=>{
      queryInterface.addColumn(
        'Comments',
        'postId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Posts',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      );
    }).then(()=>{
      queryInterface.addColumn(
        'Comments',
        'productId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Products',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      );
    }).then(()=>{
      queryInterface.addColumn(
        'Comments',
        'storeId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Stores',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      );
    }).then(()=>{
      queryInterface.addColumn(
        'Comments',
        'deletedAt',
        {
          type: Sequelize.DATE
        }
      );
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Comments','postId')
    .then(()=>{
      queryInterface.removeColumn('Comments','productId');
    }).then(()=>{
      queryInterface.removeColumn('Comments','authorId');
    }).then(()=>{
      queryInterface.removeColumn('Comments','storeId');
    }).then(()=>{
      queryInterface.removeColumn('Comments','deletedAt');
    })
  }
};
