var db = require('../models/index');
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

exports.signUp = function(req,res){
    res.render('signup');
}

exports.register = function(req,res){
    var thisUser = {
        username: req.body.username, 
        password: req.body.password,
        authId: "local:"+req.body.username,
        displayName: req.body.nickname
    }
    db.User.find({where: {username: req.body.username}})
    .then((user)=>{
        if(user===null){
            var salt = bcrypt.genSaltSync();
            console.log("in hook\n\n");
            bcrypt.hash(thisUser.password, salt, function(err,hash){
                if(err) 
                    throw(err);
                thisUser.password = hash
                console.log('hash creation', thisUser.password, hash);
                
                db.User
                .create(thisUser)
                .then((user)=>{
                    console.log('created a user! \n', user.password);
                })
                .error((err)=>{
                    console.log('creation error',err);
                })
            });            
        }else{
            res.redirect('/signup');
        }
    })
    res.redirect('/');
}