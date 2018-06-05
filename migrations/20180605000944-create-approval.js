'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Approvals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      requestDate: {
        type: Sequelize.DATE
      },
      deniedChk: {
        type: Sequelize.BOOLEAN
      },
      whyDeny: {
        type: Sequelize.TEXT
      },
      storeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Stores', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      providerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Providers', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    return queryInterface.dropTable('Approvals');
  }
};