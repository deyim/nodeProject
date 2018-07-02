'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Stores'
    ,'storeLogoPath'
    ,{
      type: Sequelize.BLOB
    }).then(()=>{
      queryInterface.changeColumn('Stores'
    ,'storeImgPath'
    ,{
      type: Sequelize.BLOB
    })
    })
  },

  down: (queryInterface, Sequelize) => {
    
  }
};
