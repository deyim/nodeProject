'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Prices',
      'optionId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Options', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    ).then(()=>{
      queryInterface.addColumn(
        'Prices',
        'productId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Products', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Prices',
      'optionId'
    ).then(()=>{
      queryInterface.removeColumn(
        'Prices',
        'productId'
      )
    })
  }
};
