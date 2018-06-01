var db = require('../models/index');
var bodyParser = require('body-parser');


exports.register = function(req,res){
    var thisUser = {
        username: req.body.username, 
        password: req.body.password,
        email: req.body.email,
        nickname: req.body.nickname
    }
    db.User.create(thisUser)
    .then((user)=>{
        req.logIn(user, function(err) {
            if (err) { return res.send(err);  }
            return res.redirect('/');
         });
    })
    .catch((err)=>{
        console.log(err);
        req.flash("error" , err );
        res.locals.messages = req.flash();
        return res.redirect('/auth/signup');
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
    res.redirect('/');
}