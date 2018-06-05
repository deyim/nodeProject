// const express = require('express');
// const route = express.Router();
const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
// const queryString = require('query-string');

module.exports = {
    //middleware, find a user by id
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
            req.provider = provider;
            provider.getUser(user=>{
                req.user = user;
            })
            db.Store.findAll({
                include: [
                    {
                        model: db.Provider, 
                        as: 'provider', 
                        foreignKey: 'providerId',
                        where: {
                            id: provider.id
                        }
                    }
                ]
            })
            .then(stores=>{
                req.stores = stores;
                next();
            });          
            
        })
    },

    //providers - index
    providersIndex: (req,res)=>{
       
        if(Object.keys(req.query).length === 0){
            db.Provider.findAll()
            .then(providers=>{
                res.render('1_members/providers_index', {providers});
            });   
        }      
        else{
            let q = req.query;
            console.log('\n\n***',q);
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
                                    {model: db.User, where:{username: q.username}},
                                    {model: db.User, where:{nickname: q.nickname}},
                                    {model: db.User, where:{recSMS: q.recSMS}},
                                    {model: db.User, where:{recEmail: q.recEmail}},
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
                provider:req.provider, 
                user: req.user, 
                stores: req.stores, 
                today:Date.now()
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
            db.Provider.findById(store.provider_id)
            .then(provider=>{
                req.provider = provider;
            })
            db.User.findAll({
                include: [{
                  model: db.Store,
                  as: 'stores',
                  required: true,
                  through: {attributes:[]}
                }]
            }).then(users=>{
                req.users = users;
                next();
            })
            // next();
        })
        //회원 정보도 다 가져와야돼??
        
    },
    //stores - index
    storesIndex: (req,res)=>{
        
        if(Object.keys(req.query).length === 0){
            db.Store.findAll()
            .then(stores=>{
                res.render('1_members/stores_index', {stores});
            });   
        }      
        else{
            let q = req.query;
            db.Store.findAll({
                // [Op.or]:[{
                    where:{
                        [Op.or]:
                        [
                            {createdAt: {
                                    [Op.gte]: q.startdate ? q.startdate : null,
                                    [Op.lte]: q.enddate ? q.enddate : null,
                                }
                            },
                            { url: q.url }
                        ]                    
                    },
                    // include: [//provider 의 id, 사업자명, 회원유형
                    //     {
                    //         [Op.or]:
                    //         [
                    //             // {model: Provider, where:{username: q.username}},
                    //             {model: db.Provider, where:{companyName: q.companyName}},
                    //             {model: db.Provider, where:{companyType: q.companyType}},
                    //         ]
                    //     }
                    // ]
                // }]
            })
            .then(stores=>{
                res.render('1_members/stores_index', {stores});
            })
        }
    },
    //stores - show
    storesShow: (req,res)=>{
        res.render('1_members/stores_show',{store:req.store, provider:req.provider, users:req.users});
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