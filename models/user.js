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
    }
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
    User.hasOne(models.Provider, {as: 'provider'});
    User.hasOne(models.Master, {as: 'master'});
    User.hasMany(models.Sentmessage, {as: 'sendings', foreignKey: 'senderId'});
    User.hasMany(models.Sentmessage, {as: 'receivings', foreignKey: 'receiverId'});
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