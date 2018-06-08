'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Boards',
      'noticeChk',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    ).then(()=>{
      queryInterface.addColumn(
        'Posts',
        'noticeChk',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Boards','noticeChk')
    .then(()=>{
      queryInterface.removeColumn('Posts','noticeChk');
    })
  }
};
