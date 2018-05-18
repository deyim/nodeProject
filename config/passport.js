module.exports = function(app){
    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy
    const KakaoStrategy = require('passport-kakao').Strategy
    const db = require('../models/index');
    const bcrypt = require('bcrypt');
    app.use(passport.initialize());
    app.use(passport.session());

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

    passport.use('local', new LocalStrategy(
        function(username, password, done) {

            db.User.find({where: {username: username}})
            .then((user)=>{
                if(!user){
                    console.log('no username');
                    return done(null, false, { message: '잘못된 메일입니다.' });
                    // return done(null, false, req.flash('잘못된 이메일입니다.'));
                }
                return db.User.validPassword(password, user.password, done, user);
            });
        }
    ));

    return passport;
}


    // passport.use(new KakaoStrategy({
    //     clientID : '5b2aec4362d86ae727f7150188a889c5',
    //     clientSecret: 'XxZQdYrHCgiRhZlwKCGB6zlwuXuniAZl', // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
    //     callbackURL : 'http://localhost:3000/oauth/kakao'
    //     },
    //     function(accessToken, refreshToken, profile, done){
    //         // 사용자의 정보는 profile에 들어있다.
    //             // console.log(profile);
    //             // return done(null, profile);
    //         db.User.find({where: {authId: 'kakao:'+profile.id}})
    //         .then((user)=>{
    //             if(!user){
    //                 db.User.create({
    //                     // username: profile.id,
    //                     authId: 'kakao:'+profile.id,
    //                     displayName: profile.displayName
    //                 });
    //                 return done('')
    //             }
    //             return done(null, user);
    //         });
    //     }
    // ));