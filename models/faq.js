'use strict';
module.exports = (sequelize, DataTypes) => {
  var Faq = sequelize.define('Faq', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    type: DataTypes.STRING(1)
  }, {});
  Faq.associate = function(models) {
    Faq.belongsTo(models.FAQcode, {as:'faqcode', foreignKey: 'faqcodeId'});
  };
  return Faq;
};