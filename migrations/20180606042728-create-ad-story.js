'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AdStories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(30)
      },
      imgPath: {
        type: Sequelize.STRING(150)
      },
      imgUrl: {
        type: Sequelize.STRING(150)
      },
      onDisplayChk: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      connectUrl: {
        type: Sequelize.STRING(150)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('AdStories');
  }
};