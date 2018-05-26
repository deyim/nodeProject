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
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      nickname: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING(15)
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
        type: Sequelize.STRING(150)
      },
      providerChk: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      masterChk: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    return queryInterface.dropTable('Users');
  }
};