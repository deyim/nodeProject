'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return ( 
      queryInterface.addColumn('Categoryfills', 'storeId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Stores', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      })
      .then(()=>{
          queryInterface.addColumn('Markets', 'storeId',{
          type: Sequelize.INTEGER,
          references: {
            model: 'Stores', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        })
      }) 
      .then(()=>{
        queryInterface.addColumn('Markets', 'providerId',{
        type: Sequelize.INTEGER,
        references: {
          model: 'Providers', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        })
      }) 
      .then(()=>{
        queryInterface.addColumn('Boards', 'storeId',{
          type: Sequelize.INTEGER,
          references: {
            model: 'Stores', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        })
      })
      .then(()=>{
        queryInterface.addColumn('Boards', 'providerId',{
          type: Sequelize.INTEGER,
          references: {
            model: 'Providers', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        })
      })
      .then(()=>{
        queryInterface.addColumn('Stores', 'providerId',{
          type: Sequelize.INTEGER,
          references: {
            model: 'Providers', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        })
      })
    );
  },

  down: (queryInterface, Sequelize) => {
    return (
      queryInterface.removeColumn('Categoryfills', 'storeId')
      .then(()=>{
        queryInterface.removeColumn('Markets', 'storeId');
      })
      .then(()=>{
        queryInterface.removeColumn('Markets', 'providerId');
      })
      .then(()=>{
        queryInterface.removeColumn('Boards', 'storeid');
      })
      .then(()=>{
        queryInterface.removeColumn('Boards', 'providerId');
      })
      .then(()=>{
        queryInterface.removeColumn('Stores', 'providerId');
      })
  );
}
};
