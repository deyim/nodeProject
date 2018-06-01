'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING
      },
      loginDate: {
        type: Sequelize.DATE
      },
      loginCnt: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      recEmail: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      recSMS: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      photoPath: {
        type: Sequelize.STRING
      },      
      userStatus:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'U'
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
    return queryInterface.dropTable('Users');
  }
};