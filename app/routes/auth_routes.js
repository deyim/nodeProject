module.exports = (passport) => {
    
    var express = require('express');
    var route = express.Router();
    const db = require('../../models/index');
    const userFunc = require('../../lib/auth_functions');
    

    route.get('/login', (req,res)=>{
      var errorMsg = null;
      if(res.locals.message.error!=undefined){
        errorMsg = res.locals.message.error[0];
      }
      req.session.message = [];
      res.render('auth/login', {message: errorMsg});
    });
    
    route.post('/authenticate', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
          if (err) {
            return next(err); // will generate a 500 error
          }
          if (!user) {
            req.flash( "error" , "잘못된 아이디 혹은 비밀번호입니다.");
            req.session.message = req.flash();   
            return res.redirect('/auth/login');
          }
          else{
            //통계 1늘리기
            user.update({
              loginDate: new Date(),
              loginCnt: user.loginCnt+1
            })
            .then(()=>{
              req.login(user, function(err){
                if(err){
                  return next(err);
                }
                if(res.locals.message){
                  delete res.locals.message;
                }    
                return res.redirect('/');        
              });
            });            
          }
        })(req, res, next);
      });
    route.get('/logout', userFunc.destroySession);


    route.get('/signup', (req,res)=>{
      var errorMsg = null;
      if(res.locals.message.error!=undefined){
        errorMsg = res.locals.message.error[0];
      }
      req.session.message = [];
      res.render('auth/sign_up', { messages: errorMsg });
    });
   
    route.post('/register', userFunc.register);
    
    return route;
}