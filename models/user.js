'use strict';
var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {type: DataTypes.STRING, unique:true},
    authId: {type: DataTypes.STRING},
    displayName: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING}
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
   
  User.validPassword = function(password, passwd, done, user){
    bcrypt.compare(password, passwd, function(err, res){
      if(err){
        // return done(null, false, { message: '잘못된 패스워드입니다' });
      }
      if(res){
          return done(null, user);
      }else {
          return done(null, false);
      }
    });
  }

  return User;
};