'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Commentas',
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
        'Commentas',
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Commentas','authorId')
    .then(()=>{
      queryInterface.removeColumn('Commentas','postId');
    });
  }
};
