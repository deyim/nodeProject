'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Sentmessages',
      'messaageId'
    ).then(()=>{
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
      );
    });    
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
        'Sentmessages',
        'messageId',
    );
  }
};
