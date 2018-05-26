module.exports = (passport) => {
    
    var express = require('express');
    var route = express.Router();
    const db = require('../../models/index');
    const userFunc = require('../../lib/auth_functions');

    // route.get('/login', (req,res)=>{
    //     res.render('auth/login');
    // });
    // route.get('/', (req,res)=>{
    //     res.send('index');
    // })
    route.post('/authenticate', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
          if (err) {
            return next(err); // will generate a 500 error
          }
          // Generate a JSON response reflecting authentication status
          if (!user) {
            return res.render('auth/login', {errorMsg: '잘못된 이메일 혹은 비밀번호입니다.'});
          }
          req.login(user, function(err){
            if(err){
              return next(err);
            }
            console.log('\n\n\n*****\n\n',user.providerChk)
            if(db.User.ifMaster(user)){                
                return res.redirect('/main');
            }
            else{
                return next("관리자가 아닙니다.");
            }
            // return res.redirect('/');        
          });
        })(req, res, next);
      });

    route.get('/logout', userFunc.destroySession);


    // route.get('/signup', (req,res)=>{
    //     res.render('auth/sign_up');
    // });
   
    // route.post('/register', userFunc.register);
  

    return route;
}