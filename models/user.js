'use strict';
// var bcrypt = require('bcrypt-nodejs');
var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {type: DataTypes.STRING, unique:true},
    password: {type: DataTypes.STRING}
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  // User.hook('beforeCreate', function(user,options){
  //   var salt = bcrypt.genSaltSync();
  //   console.log("in hook\n\n");

  //   bcrypt.hash(user.password, salt, null, function(err,hash){
  //     if(err) 
  //       throw(err);
  //     user.password = hash;
  //   })
  // })
  
  // User.validPassword = function(password, passwd, done, user){
  //     bcrypt.compare(password, passwd, function(err, isMatch){
  //       if(err) console.log(err,'hihihihihi');
  //       if(isMatch){
  //         return done(null, user);
  //       }else {
  //         return done(null,false);
  //       }
  //     })
  // }

  return User;
};