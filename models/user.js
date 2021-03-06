'use strict';
var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: DataTypes.STRING,
    loginDate: DataTypes.DATE,
    loginCnt: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    recEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    recSMS: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    photoPath: DataTypes.STRING, 
    userStatus:{
      type: DataTypes.STRING,
      defaultValue: 'U'
      //user:U / provider:P / master:M
    },
    name: DataTypes.STRING(30)
  }, {
    hooks: {
      afterValidate: (user)=>{
        console.log('validation');
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
      }
    },
    paranoid: true,
  });


  User.associate = function(models) {
    User.hasOne(models.Provider, {as: 'provider', foreignKey: 'userId'});
    // User.hasOne(models.Master, {as: 'user'});
    User.hasMany(models.Sentmessage, {as: 'sendings', foreignKey: 'senderId'});
    User.hasMany(models.Sentmessage, {as: 'receivings', foreignKey: 'receiverId'});
    User.hasMany(models.Order, {as: 'orders', foreignKey: 'buyerId'});
    User.belongsToMany(models.Store, {
      through: 'StoreUsers',
      as: 'stores',
      foreignKey: 'userId'
    });
    User.hasMany(models.Post, {as: 'posts', foreignKey: 'authorId'});
    User.hasMany(models.Comment, {as: 'comments', foreignKey: 'authorId'});
    // User.hasMany(models.Commentb, {as: 'commentbs', foreignKey: 'authorId'});
    User.hasMany(models.Visiting, {as: 'visitings', foreignKey: 'userId'});
    User.hasMany(models.Viewcount, {as: 'viewcounts', foreignKey: 'userId'});
    User.hasMany(models.StoreVisit, {as: 'storevisits', foreignKey: 'userId'});
  };

  User.validPassword = function(password, passwd, done, user){
    bcrypt.compare(password, passwd, function(err, res){
      if(err){
         return done(null, false);
      }
      if(res){
          return done(null, user);
      }else {
          return done(null, false);
      }
    });
  }

  User.checkStatus = (user)=>{
    return user.userStatus;
  }

  return User;
};