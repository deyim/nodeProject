'use strict';
var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    phone: DataTypes.STRING(15),
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
    photoPath: DataTypes.STRING(150),
    providerChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    masterChk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {});


  User.associate = function(models) {
    User.hasOne(models.Provider, {as: 'Provider'});
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

  User.ifProvider = (user)=>{
    if(user.providerChk){
      return true
    }
    else{
      return false;
    }
  }

  User.ifMaster = (user)=>{
    if(user.masterChk){
      return true
    }
    else{
      return false;
    }
  }

  return User;
};