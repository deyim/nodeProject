'use strict';

//대댓글 구현을 위한 코딩
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Comments', 'commentId',
  {
    type: Sequelize.INTEGER,
    references: {
      model: 'Comments',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Comments', 'commentId');
  }
};
