var db = require('../models/index');
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

exports.register = function(req,res){
    var thisUser = {
        username: req.body.username, 
        password: req.body.password,
        email: req.body.email,
        nickname: req.body.nickname
    }
    db.User.find({where: {username: req.body.username}})
    .then((user)=>{
        if(user===null){
            var salt = bcrypt.genSaltSync();
            bcrypt.hash(thisUser.password, salt, function(err,hash){
                if(err) 
                    throw(err);
                thisUser.password = hash                
                db.User
                .create(thisUser)
                .then((user)=>{
                    req.logIn(user, function(err) {
                        if (err) { return res.send(err);  }
                        return res.redirect('/');
                    });
                })
                .error((err)=>{
                    console.log('creation error',err);
                })
            });            
        }else{
            res.redirect('/auth/signup');
        }
    });
}

exports.IsAutenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        next(new Error(401));
    }
}
exports.destroySession = function(req,res,next){
    req.logOut();
    req.session.destroy();
    res.redirect('/');
}