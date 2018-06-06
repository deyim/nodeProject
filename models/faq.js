'use strict';
module.exports = (sequelize, DataTypes) => {
  var Faq = sequelize.define('Faq', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {});
  Faq.associate = function(models) {
    // associations can be defined here
  };
  return Faq;
};