'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Products',
    'countType',
    {
      type: Sequelize.STRING(1)
    }
  ).then(()=>{
    queryInterface.addColumn('Products',
    'priceType',
    {
      type: Sequelize.STRING(1)
    })
  }).then(()=>{
    queryInterface.removeColumn('Options','priceType');
  }).then(()=>{
    queryInterface.removeColumn('Options','countType');
  }).then(()=>{
    queryInterface.removeColumn('Options','start');
  }).then(()=>{
    queryInterface.removeColumn('Options','end');
  }).then(()=>{
    queryInterface.removeColumn('Options','childstart');
  }).then(()=>{
    queryInterface.removeColumn('Options','childend');
  })
},

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Products',
    'countType')
  .then(()=>{
    queryInterface.removeColumn('Products',
    'priceType')
  }).then(()=>{
    queryInterface.addColumn('Options','priceType',{type: Sequelize.STRING(1)});
  }).then(()=>{
    queryInterface.addColumn('Options','countType',{type: Sequelize.STRING(1)});
  }).then(()=>{
    queryInterface.addColumn('Options','start',{type: Sequelize.STRING(1)});
  }).then(()=>{
    queryInterface.addColumn('Options','end',{type: Sequelize.STRING(1)});
  }).then(()=>{
    queryInterface.addColumn('Options','childstart',{type: Sequelize.STRING(1)});
  }).then(()=>{
    queryInterface.addColumn('Options','childend',{type: Sequelize.STRING(1)});
  })
  }
};
