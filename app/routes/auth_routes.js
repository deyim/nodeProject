module.exports = (passport) => {
    
    var express = require('express');
    var route = express.Router();
    const db = require('../../models/index');
    const userFunc = require('../../lib/auth_functions');

    route.get('/login', (req,res)=>{
        res.render('auth/login',{error : req.session.error});
    });
    
    route.post('/authenticate', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
          if (err) {
            return next(err); // will generate a 500 error
          }
          // Generate a JSON response reflecting authentication status
          if (!user) {
            req.session.error = '잘못된 아이디 혹은 비밀번호입니다.';
            res.redirect('/auth/login');
            // return res.render('auth/login', {errorMsg: '잘못된 이메일 혹은 비밀번호입니다.'});
            // return res.redirect('auth/login', {errorMsg: '잘못된 이메일 혹은 비밀번호입니다.'});
          }
          req.login(user, function(err){
            if(err){
              return next(err);
            }
            if(req.session.error){
              delete req.session.error;
            }    
            return res.redirect('/');        
          });
        })(req, res, next);
      });
    route.get('/logout', userFunc.destroySession);


    route.get('/signup', (req,res)=>{
        res.render('auth/sign_up');
    });
   
    route.post('/register', userFunc.register);
    

    //kakao login
    // route.get('/kakao', passport.authenticate('kakao'));
    // route.get('/oauth/kakao', 
    //     passport.authenticate('kakao',{
    //         successRedirect : '/',
    //         failureRedirect : '/failure'
    //     })
    // );


    return route;
}