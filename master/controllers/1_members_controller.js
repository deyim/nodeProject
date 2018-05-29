// const express = require('express');
// const route = express.Router();
const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
// const queryString = require('query-string');

module.exports = {
    findUser: (req,res,next)=>{
        db.User.findById(req.params.user_id)
        .then(user=>{
            if(!user){
                req.flash('error', '없는 유저입니다.');
                res.redirect('/members/users');
            }
            req.user = user;
            next();
        })
    },
    //users - index
    usersIndex: (req,res)=>{
        // console.log('\n\n\n\n*******\n\n',req.query);
        if(Object.keys(req.query).length === 0){
            db.User.findAll()
            .then(users=>{
                res.render('1_members/users_index', {users});
            });   
        }      
        else{
            let q = req.query;
            db.User.findAll({
                where:{
                    [Op.or]:
                    [
                        {createdAt: {
                                [Op.gte]: q.startdate ? q.startdate : null,
                                [Op.lte]: q.enddate ? q.enddate : null,
                            }
                        },
                        { username: q.username },
                        { nickname: q.nickname },
                        { recEmail: q.recEmail },
                        { recSMS: q.recSMS }
                    ]                    
                }
            })
            .then(users=>{
                res.render('1_members/users_index', {users});
            })
        }
           
    },    
    //users - show
    usersShow: (req,res)=>{     
        res.render('1_members/users_show', {user:req.user, today:Date.now()});
    },   
    //users - update
    usersUpdate: (req,res)=>{
        req.user.update(req.body)
        .then((()=>{
            req.session.alert = '수정되었습니다.'
            res.redirect(`/members/users/${req.user.id}`);
        }));
    },
    //users - delete
    usersDelete: (req,res)=>{
        req.user.destroy();
        res.redirect('/members/users');
    },
    //users - send messages
    //공통인데 어떻게 구현할지 생각해보자. 

    findProvider: (req,res,next)=>{
        db.Provider.findById(req.params.provider_id)
        .then(provider=>{
            if(!provider){
                req.flash('error', '없는 스토어회원입니다.');
                res.redirect('/members/providers');
            }
            user = provider.getUser();
            // stores = provider.getStores();

            //maybe we need to promise 'em
            req.provider = provider;
            req.user = user;
            req.stores = stores;
            
            next();
        })
        //스토어 자체도 받아와야되나??;; 
    },

    //providers - index
    providersIndex: (req,res)=>{
        // console.log('\n\n\n\n*******\n\n',req.query);
        if(Object.keys(req.query).length === 0){
            db.User.findAll()
            .then(users=>{
                res.render('1_members/providers_index', {users});
            });   
        }      
        else{
            let q = req.query;
            // 아이디, 닉네임, 메일, SMS는 User에 => & provider인애?
            //OR 개설승인일 사업자명, 회원유형 => provider 
            db.Provider.findAll({
                [Op.or]:[
                    {
                        where:{
                            [Op.or]:
                            [
                                {createdAt: {
                                        [Op.gte]: q.startdate ? q.startdate : null,
                                        [Op.lte]: q.enddate ? q.enddate : null,
                                    }
                                },
                                {companyName: q.companyName},
                                {companyType: q.companyType},
                            ]                
                        }
                    },
                    {
                        include:[
                            {
                                [Op.or]:
                                [
                                    {model: User, where:{username: q.username}},
                                    {model: User, where:{nickname: q.nickname}},
                                    {model: User, where:{recSMS: q.recSMS}},
                                    {model: User, where:{recEmail: q.recEmail}},
                                ]
                            }
                        ]
                    }
                ]
            })
            .then(providers=>{
                res.render('1_members/providers_index', {providers});
            })
        }
      
    },
    //providers - show
    providersShow: (req,res)=>{
        res.render('1_members/providers_show', 
            {
                provider:req.provider, user: req.user, 
                stores: req.stores, today:Date.now()
            }
        );
        //고치는거는 스토어회원 정보만 고치는거로 하자. 
    },
    //providers - update
    providersUpdate: (req,res)=>{
        req.provider.update(req.body)
        .then((()=>{
            req.session.alert = '수정되었습니다.'
            res.redirect(`/members/providers/${req.provider.id}`);
        }));
    },
    //providers - delete
    providersDelete: (req,res)=>{
        req.provider.destroy();
        res.redirect('/members/providers');
    },
    //providers - send messages


    findStore: (req,res,next)=>{
        db.Store.findById(req.params.store_id)
        .then(store=>{
            if(!store){
                req.flash('error', '없는 스토어입니다.');
                res.redirect('/members/stores');
            }
            req.store = store;
            next();
        })
        //회원 정보도 다 가져와야돼??
        
    },
    //stores - index
    storesIndex: (req,res)=>{
        if(Object.keys(req.query).length === 0){
            db.User.findAll()
            .then(users=>{
                res.render('1_members/users_index', {users});
            });   
        }      
        else{
            let q = req.query;
            db.Store.findAll({
                where:{
                    [Op.or]:
                    [
                        {createdAt: {
                                [Op.gte]: q.startdate ? q.startdate : null,
                                [Op.lte]: q.enddate ? q.enddate : null,
                            }
                        },
                        { username: q.username },
                        { nickname: q.nickname },
                        { recEmail: q.recEmail },
                        { recSMS: q.recSMS }
                    ]                    
                }
            })
            .then(stores=>{
                res.render('1_members/stores_index', {stores});
            })
        }
    },
    //stores - show
    storesShow: (req,res)=>{
        res.render('1_members/stores_show');
    },
    //stores - update
    storesUpdate: (req,res)=>{
        req.store.update(req.body)
        .then((()=>{
            req.session.alert = '수정되었습니다.'
            res.redirect(`/members/stores/${req.store.id}`);
        }));
    },
    //stores - delete
    storesDelete: (req,res)=>{
        req.user.destroy();
        res.redirect('/members/users');
    }
}