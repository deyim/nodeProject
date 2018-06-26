// const express = require('express');
// const route = express.Router();
const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 10;
// const queryString = require('query-string');

module.exports = {
     /***********************
          members/common
    ***********************/

    sendMessage: (req,res)=>{
        receivers = req.body.receivers.split(',');
        db.Message.create({
            content: req.body.content
        })
        .then(message=>{
            for(var i = 0 ; i < receivers.length ; i++){
                console.log('\n\n**',receivers[i] *= 1);
                db.Sentmessage.create({
                    senderId: req.user.id,
                    receiverId: receivers[i],
                    messageId: message.id
                })
                .then((sentmessage)=>{
                    console.log(sentmessage);
                });
            }
            res.redirect('/members/users');
        });
        
    },

    writeMessages: (req,res)=>{
        res.render('1_members/send_messages', {receivers: req.body.checked});
    },

    /***********************
          members/users
    ***********************/

    //middleware, find a user by id
    findUser: (req,res,next)=>{
        db.User.findById(req.params.user_id)
        .then(user=>{
            if(!user){
                req.flash('error', '없는 유저입니다.');
                res.redirect('/members/users');
            }
            req.user = user;

            user.getStores()
            .then(stores=>{req.stores = stores;});
           
            
            user.getSendings()
            .then(sendings=>{req.sendings = sendings.length || 0;});

            user.getReceivings()
            .then(receivings=>{req.receivings = receivings.length || 0;
                
            });

            user.getPosts()
            .then(posts=>{req.posts = posts.length || 0;next();});
           
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
        dataobj = {user:req.user, posts:req.posts, sendings:req.sendings, receivings:req.receivings, stores:req.stores};
        dataobj.storesCnt = req.stores? req.stores.length : 0;
        res.render('1_members/users_show', dataobj);
    },   

    //users - update
    usersUpdate: (req,res)=>{
        let user = req.body;
        user.phone = '010-'+user.phone1+'-'+user.phone2;
        delete user.phone1;
        delete user.phone2;

        if(!req.body.recSMS){
            user.recSMS = false;
        }
        if(!req.body.recEmail){
            user.recEmail = false;
        }
        console.log('\n\n\n\n', user, req.body);
        req.user.update(user)
        .then((()=>{
            res.redirect(`/members/users/${req.user.id}`);
        }));
    },

    //users - delete
    usersDelete: (req,res)=>{
        req.user.destroy();
        res.redirect('/members/users');
    },

    deleteMultipleUsers: (req,res)=>{
       
        users = req.body.checked.toString().split(',');
        for(var i = 0 ; i < users.length; i++){
            db.User.findById(users[i])
            .then(user=>{
                user.destroy();
            });
        };
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
            provider.getUser()
            .then(user=>{req.user = user;});

            //stores
            provider.getStores()
            .then(stores=>{req.stores = stores; next();});
    
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
            db.Provider.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
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
                storesCnt: req.stores.length
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
        })
        //회원 정보도 다 가져와야돼??
        
    },
    //stores - index
    storesIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page; 
        if(Object.keys(req.query).length === 0){
            db.Store.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(stores=>{
                objData = {stores:stores.rows, storesCnt:stores.count}
                res.render('1_members/stores_index', objData);
            });   
        }      
        else{
            db.Store.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
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
                        {url:  { [Op.like]: `%${q.url}%` }},
                    ]                    
                },
                include: [//provider 의 id, 사업자명, 회원유형
                    {
                        model: db.Provider,
                        as: 'provider',
                        where: {
                            [Op.and]:
                            [
                                {companyName:{ [Op.like]: `%${q.companyName}%`}},
                                {companyType:{ [Op.like]: `%${q.companyType}%`}},
                            
                            ]
                        },
                        include: [
                            {
                                model: db.User,
                                as: 'user',
                                where: {
                                    [Op.and]:
                                    [
                                        {username:{ [Op.like]: `%${q.username}%`}},
                                    ]
                                }
                            }
                        ]
                        
                    }
                ]
            })
            .then(stores=>{
                objData = {stores:stores.rows, storesCnt:stores.count}
                res.render('1_members/stores_index', objData);
            })
        }
    },
    //stores - show
    storesShow: (req,res)=>{
        objData = {store:req.store, provider:req.provider, users:req.users};
        res.render('1_members/stores_show',objData);
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
        req.store.destroy();
        res.redirect('/members/users');
    },

    multipleStoresDelete: (req,res)=>{
       
        stores = req.body.checked.toString().split(',');
        for(var i = 0 ; i < stores.length; i++){
            db.Store.findById(stores[i])
            .then(store=>{
                store.destroy();
            });
        };
        res.redirect('/members/stores');
    }
}