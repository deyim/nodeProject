'use strict';
module.exports = (sequelize, DataTypes) => {
  var City = sequelize.define('City', {
    city: {
      type: DataTypes.STRING(20),
      allowNull:false
    }
  }, {
    timestamps: false
  });
  City.associate = function(models) {
    City.belongsTo(models.Nation, {as: 'nation', foreignKey:'nationId'});
    City.belongsToMany(models.Store, {
      through: 'StoreCities',
      as: 'stores',
      foreignKey: 'cityId'
    });
    City.belongsToMany(models.Product, {
      through: 'ProductCities',
      as: 'products',
      foreignKey: 'cityId'
    });
  };
  return City;
};