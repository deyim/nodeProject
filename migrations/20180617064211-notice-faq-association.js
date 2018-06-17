'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Faqs',
      'faqcodeId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Faqs', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    ).then(()=>{
      queryInterface.addColumn(
        'Notices',
        'noticecodeId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Notices', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
    })
    .then(()=>{
      queryInterface.addColumn(
        'Faqs',
        'type',
        {
          type: Sequelize.STRING(1),          
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Faqs',
      'faqcodeId'
    ).then(()=>{
      queryInterface.removeColumn(
        'Notices',
        'noticecodeId'
      )
    })
    .then(()=>{
      queryInterface.removeColumn(
        'Faqs',
        'type'
      )
    })
  }
};
