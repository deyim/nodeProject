'use strict';
module.exports = (sequelize, DataTypes) => {
  var StoreFile = sequelize.define('StoreFile', {
    storeId: DataTypes.INTEGER,
    file: DataTypes.BLOB,
    filePath: DataTypes.STRING
  }, {});
  StoreFile.associate = function(models) {
    StoreFile.belongsTo(models.Store, {as:'store', foreignKey: 'storeId'});
  };
  return StoreFile;
};