'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Posts',
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
        'Posts',
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
        'Posts',
        'boardId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Boards',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      );
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Posts','authorId')
    .then(()=>{
      queryInterface.removeColumn('Posts','storeId');
    })
    .then(()=>{
      queryInterface.removeColumn('Posts','boardId');
    });
  }
};
