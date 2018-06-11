'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Sentmessages',
      'senderId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    ).then(()=>{
      queryInterface.addColumn(
        'Sentmessages',
        'receiverId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
    }).then(()=>{
      queryInterface.addColumn(
        'Sentmessages',
        'messageId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Messages', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Sentmessages',
      'senderId'
    ).then(()=>{
      queryInterface.removeColumn(
        'Sentmessages',
        'receiverId'
      )
    }).then(()=>{
      queryInterface.removeColumn(
        'Sentmessages',
        'messageId'
      )
    })
  }
};
