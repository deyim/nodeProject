'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Commentbs',
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
        'Commentbs',
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Commentbs','authorId')
    .then(()=>{
      queryInterface.removeColumn('Commentbs','productId');
    });
  }
};
