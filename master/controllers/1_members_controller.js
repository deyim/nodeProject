const db = require('../../models/index');
//const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 10;
const dateFunctions = require('../../lib/date_functions');

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
                // console.log('\n\n**',receivers[i] *= 1);
                db.Sentmessage.create({
                    senderId: req.user.id,
                    receiverId: receivers[i],
                    messageId: message.id
                })
                .then((sentmessage)=>{
                    // console.log(sentmessage);
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
        db.User.findOne({
            where: {
                id: req.params.user_id
            },
            include: [
                {
                    model: db.Store,
                    as: 'stores'
                },
                {
                    model: db.Sentmessage,
                    as: 'sendings',
                    foreignKey: 'senderId'
                },
                {
                    model: db.Sentmessage,
                    as: 'receivings',
                    foreignKey: 'receiverId'
                },
                {
                    model: db.Post,
                    as: 'posts',
                    foreignKey: 'authorId'
                }
            ]
        })
        .then(user=>{
            req.user = user;
            next();
        })
    },

    //users - index
    usersIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();

        let q = req.query;
        let page = q.page||1;
        delete q.page;  
              
        if(Object.keys(q).length === 0){
            db.User.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(users=>{
                objData = {users:users.rows, usersCount:users.count, firstday, q};
                res.render('1_members/users_index', objData);
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
               objData = {users:users.rows, usersCount:users.count, firstday, q};              
               res.render('1_members/users_index', objData);
            })
        }
           
    },     

    //users - show
    usersShow: (req,res)=>{  
        objData = {user:req.user, posts:req.user.posts.length, sendings:req.user.sendings.length, receivings:req.user.receivings.length, stores:req.user.stores};
        objData.storesCnt = req.user.stores? req.user.stores.length : 0;
        res.render('1_members/users_show', objData);
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
            provider.getStore()
            .then(store=>{req.store= store; next();});
    
        })
    },

    //providers - index
    providersIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();

        let q = req.query;
        let page = q.page||1;
        delete q.page;  

        if(Object.keys(req.query).length === 0){
            db.Provider.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.User,
                        as: 'user',
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        foreignKey: 'providerId'
                    }                 
                ]
            })
            .then(providers=>{
                objData = {providers:providers.rows, providersCount:providers.count, firstday, q}
                res.render('1_members/providers_index', objData);
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
                        {companyName:  q.companyName? { [Op.like]: `%${q.companyName}%` } : {[Op.regexp]: '^'}},
                        {companyType:  q.companyType? { [Op.like]: `%${q.companyType}%` } : {[Op.regexp]: '^'}},
                    ]                
                },
                include:[
                    {
                        model: db.User,
                        as: 'user',
                        where:{
                            [Op.and]:
                            [
                                {username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'}},
                                {nickname: q.nickname? { [Op.like]: `%${q.nickname}%` } : {[Op.regexp]: '^'}},
                                {recSMS: q.recSMS ? q.recSMS : false},
                                {recEmail: q.recEmail ? q.recEmail : false},
                            ]
                        }                                
                    }, 
                    {
                        model: db.Store,
                        as: 'store',
                        foreignKey: 'providerId'
                    }  
                ]
            })
            .then(providers=>{
                objData = {providers:providers.rows, providersCount:providers.count, firstday, q}
                res.render('1_members/providers_index', objData);                
            });   
        }
      
    },
    //providers - show
    providersShow: (req,res)=>{
        res.render('1_members/providers_show', 
            {
                provider:req.provider, 
                user: req.user, 
                store: req.store, 
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
    //delete multiple providers
    deleteMultipleProviders: (req,res)=>{       
        providers = req.body.checked.toString().split(',');
        for(var i = 0 ; i < providers.length; i++){
            db.Provider.findById(providers[i])
            .then(provider=>{
                provider.destroy();
            });
        };
        res.redirect('/members/providers');
    },
    //providers - send messages


    /**************************
          members/stores
    ***************************/


    findStore: (req,res,next)=>{ 
        db.Store.findOne({
            where: {
                id: req.params.store_id
            },
            include: [
                {
                    model: db.Provider,
                    as: 'provider'
                },
                {
                    model: db.User,
                    as: 'users'
                },
                {
                    model: db.Nation,
                    as: 'nations'
                },
                {
                    model: db.City,
                    as: 'cities'
                },
                {
                    model: db.StoreFile,
                    as: 'storeFiles'
                }
            ]
        }).then(store=>{
            req.store = store;
            next();
        })     
    },
    //stores - index
    storesIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        
        let q = req.query;
        let page = q.page||1;
        delete q.page; 

        if(Object.keys(req.query).length === 0){
            db.Store.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    approvalChk: true
                },
                include: [
                    {
                        model: db.Provider,
                        as: 'provider',
                        include: [
                            {
                                model: db.User,
                                as: 'user'
                            }
                        ]
                    }
                ]
            })
            .then(stores=>{
                objData = {stores:stores.rows, storesCnt:stores.count, firstday, q};
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
                        {approvalChk: true},
                        {createdAt: {
                                [Op.and]:[
                                    {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                    {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                ]
                            }
                        },
                        {url:  q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'}},
                    ]                    
                },
                include: [//provider 의 id, 사업자명, 회원유형
                    {
                        model: db.User,
                        as: 'users',
                        foreignKey: 'storeId'
                    },
                    {
                        model: db.Provider,
                        as: 'provider',
                        where: {
                            [Op.and]:
                            [
                                {companyName: q.companyName? { [Op.like]: `%${q.companyName}%` } : {[Op.regexp]: '^'}},
                                {companyType: q.companyType? { [Op.like]: `%${q.companyType}%` } : {[Op.regexp]: '^'}},
                            
                            ]
                        },
                        include: [
                            {
                                model: db.User,
                                as: 'user',
                                where: {
                                    [Op.and]:
                                    [
                                        {username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'}},
                                    ]
                                }
                            }
                        ]
                        
                    },
                    
                ]
            })
            .then(stores=>{
                objData = {stores:stores.rows, storesCnt:stores.count, firstday, q}
                res.render('1_members/stores_index', objData);
            })
        }
    },
    //stores - show
    storesShow: (req,res)=>{
        objData = {store:req.store, nations:req.store.nations, cities:req.store.cities};
        res.render('1_members/stores_show',objData);
    },
    //stores - update
    storesUpdate: (req,res)=>{
        console.log('\n\n\n',req.body);
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
    //stores - delete multiple stores
    multipleStoresDelete: (req,res)=>{
       
        stores = req.body.checked.toString().split(',');
        for(var i = 0 ; i < stores.length; i++){
            db.Store.findById(stores[i])
            .then(store=>{
                store.destroy();
            });
        };
        res.redirect('/members/stores');
    },

    storeAttachFile: (req,res)=>{
        //
    },
    
    storeDeleteFile: (req,res)=>{
        //
    }
}