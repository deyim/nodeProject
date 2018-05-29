module.exports = (passport) => {
    
    var express = require('express');
    var route = express.Router();
    const db = require('../../models/index');
    const userFunc = require('../../lib/auth_functions');

    route.post('/authenticate', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
          if (err) {
            return next(err); // will generate a 500 error
          }
          // Generate a JSON response reflecting authentication status
          if (!user) {
            // req.flash('error','잘못된 아이디 혹은 비밀번호입니다.');
            // req.session.error = '잘못된 아이디 혹은 비밀번호입니다.';
            return res.redirect('/login-failure');
          }
          req.login(user, function(err){
            if(err){
              return next(err);
            }
            console.log('\n\n\n*****\n\n',user.providerChk)
            if(db.User.ifMaster(user)){ 
                // if(req.session.error){
                //   delete req.session.error;
                // }               
                return res.redirect('/main');
            }
            else{
                return next("관리자가 아닙니다.");
            }    
          });
        })(req, res, next);
      });

    route.get('/logout', userFunc.destroySession);

    return route;
}