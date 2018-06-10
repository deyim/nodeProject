// const express = require('express');
// const route = express.Router();
const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 4;
// const queryString = require('query-string');

module.exports = {
    /***********************
          members/users
    ***********************/

    //users - send messages
    checkToArray: (req,res,next)=>{
        req.checked = req.body.checked;
        next();
    },

    sendMessages: (req,res)=>{
        res.send('/members/users');
    },

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
        let q = req.query;
        let page = q.page||1;
        delete q.page;        
        if(Object.keys(q).length === 0){
            db.User.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(users=>{
                res.render('1_members/users_index', {users:users.rows, usersCount:users.count});
            });   
        }      
        else{          
            db.User.findAndCountAll({
                where:{
                    [Op.and]:
                    [
                        {createdAt: {
                                [Op.and]:[
                                    {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                    {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                ]
                            }
                        },
                        {username: { [Op.like]: `%${q.username}%` }},
                        {nickname: { [Op.like]: `%${q.nickname}%` }},
                        { recEmail: q.recEmail ? q.recEmail : false},
                        { recSMS: q.recSMS ? q.recSMS : false}
                    ]                    
                },
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(users=>{
               res.render('1_members/users_index', {users:users.rows, usersCount:users.count});
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
            res.redirect(`/members/users/${req.user.id}`);
        }));
    },

    //users - delete
    usersDelete: (req,res)=>{
        req.user.destroy();
        res.redirect('/members/users');
    },
    
    /**************************
          members/providers
    ***************************/

    //req.provider
    //req.user: user account of provider
    //req.stores: stores belonging to provider
    findProvider: (req,res,next)=>{
        db.Provider.findById(req.params.provider_id)
        .then(provider=>{
            if(!provider){
                req.flash('error', '없는 스토어회원입니다.');
                res.redirect('/members/providers');
            }
            
            //provider
            req.provider = provider;

            //user
            console.log('\n\n\n***');
            provider.getUser()
            .then(user=>{req.user = user;});
            

            //stores
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
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        if(Object.keys(req.query).length === 0){
            db.Provider.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(providers=>{
                objectData = {providers:providers.rows, providersCount:providers.count}
                res.render('1_members/providers_index', objectData);
            });   
        }      
        else{
            console.log(q);
            db.Provider.findAndCountAll({
                where:{
                    [Op.and]:
                    [
                        {createdAt: {
                            [Op.and]:[
                                {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                            ]
                        }
                        },
                        {companyName:  { [Op.like]: `%${q.companyName}%` }},
                        {companyType:  { [Op.like]: `%${q.companyType}%` }},
                    ]                
                },
                include:[
                    {
                        model: db.User,
                        as: 'user',
                        where:{
                            [Op.and]:
                            [
                                {username: { [Op.like]: `%${q.username}%` }},
                                {nickname: { [Op.like]: `%${q.nickname}%` }},
                                {recSMS: q.recSMS ? q.recSMS : false},
                                {recEmail: q.recEmail ? q.recEmail : false},
                            ]
                        }                                
                    }
                ]
            })
            .then(providers=>{
                console.log(providers.rows);
                objectData = {providers:providers.rows, providersCount:providers.count}
                res.render('1_members/providers_index', objectData);
            });   
        }
      
    },
    //providers - show
    providersShow: (req,res)=>{
        res.render('1_members/providers_show', 
            {
                provider:req.provider, 
                user: req.user, 
                stores: req.stores, 
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


    /**************************
          members/stores
    ***************************/


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