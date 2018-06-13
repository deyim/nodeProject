'use strict';
module.exports = (sequelize, DataTypes) => {
  var Nation = sequelize.define('Nation', {
    nation: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {});
  Nation.associate = function(models) {
    Nation.hasMany(models.City, {as: 'city'});
    Nation.belongsToMany(models.Store, {
      through: 'StoreNations',
      as: 'stores',
      foreignKey: 'nationId'
    });
    Nation.belongsToMany(models.Product, {
      through: 'ProductNations',
      as: 'products',
      foreignKey: 'nationId'
    });
  };
  return Nation;
};
