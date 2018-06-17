'use strict';
module.exports = (sequelize, DataTypes) => {
  var FAQcode = sequelize.define('FAQcode', {
    code: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW 
    }
  }, {
    timestamps: false
  });
  FAQcode.associate = function(models) {
    FAQcode.hasMany(models.Faq, {as: 'faqs', foreignKey: 'faqcodeId'});
  };
  return FAQcode;
};