var db = require('../models/index');
var bodyParser = require('body-parser');

exports.signUp = function(req,res){
    res.render('signup');
}

exports.register = function(req,res){
    db.User.find({where: {username: req.body.username}})
    .then((user)=>{
        if(user===null){
            db.User
            .create({username: req.body.username, password: req.body.password})
            .then((user)=>{
                console.log('created a user! ', user);
            })
            .error((err)=>{
                console.log('creation error',err);
            })
        }else{
            res.redirect('/signup');
        }
    })
    res.redirect('/');
}