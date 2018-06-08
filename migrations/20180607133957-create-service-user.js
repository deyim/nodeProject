'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ServiceUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      korName: {
        type: Sequelize.STRING
      },
      engName: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.STRING
      },
      korPhone: {
        type: Sequelize.STRING
      },
      tourPhone: {
        type: Sequelize.STRING
      },
      kakao: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ServiceUsers');
  }
};