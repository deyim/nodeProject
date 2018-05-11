var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , db = require('../models/index');


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    db.User.find({where: {id: user.id}})
    .then((user)=>{
        done(null, user);
    })
    .catch((err)=>{
        done(err,null);
    });
});

passport.use(new LocalStrategy(
  function(username, password, done) {

    db.User.find({where: {username: username}})
    .then((user)=>{
        if(user == null){
            return done(null, false, { message: 'Incorrect username.' });
        }
        if(user.password != password){ 
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    })
    // db.User.find({where : {username: username}})
    // .then((user)=>{
    //     passwd = user ? user.password : '';
    //     isMatch = db.User.validPassword(password, passwd, done, user);
    // })
  }
));