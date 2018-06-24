const db = require('../../models/index');
const bodyParser = require('body-parser');
// const dateConverter = require('../../lib/date_functions');
const Op = db.Sequelize.Op;
const perPage = 5;

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
  
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('-');
};

module.exports = {
    findProduct: (req,res,next)=>{
        db.Product.find({
            where: {
                id: req.params.product_id,
            }
        })
        .then(product=>{
            if(!product){
                req.flash('error', '없는 상품입니다.');
                res.redirect('/stores/products');
            }
            req.product = product;

           //find unavailable dates!!

            product.getProductcode()
            .then(productcode=>{
                req.productcode = productcode;
            });

            product.getCategory()
            .then(category=>{
                req.category = category;
            });
            
            product.getTags()
            .then(tags=>{
                req.tags = tags;
            });

            product.getNations()
            .then(nations=>{                
                req.nations = nations;
            });

            product.getCities()
            .then(cities=>{
                req.cities = cities;
                next();
            });
        });
    },

    productsIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page;    
        if(Object.keys(req.query).length === 0){
            db.Product.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    }
                ]

            })
            .then(products=>{
                db.Category.findAll()
                .then(categories=>{
                    objData = {products:products.rows, productsCount:products.count, categories:categories}
                    res.render('2_stores/products_index', objData);
                })               
            });   
        }      
        else{
            db.Product.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where:{
                    [Op.and]:
                    [
                        {createdAt: 
                            {
                            [Op.and]:[
                                {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                ]
                            }
                        },
                        { title: q.title? { [Op.like]: `%${q.title}%` } : {[Op.regexp]: '^'}},
                        { onSaleChk: q.onSaleChk ? q.onSaleChk : false},
                        { onDisplayChk: q.onDisplayChk ? q.onDisplayChk : false}
                    ],                                  
                },
                include:[
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                    {
                        model: db.Productcode,
                        as: 'productcode',
                        where:{
                             code: q.productcode? { [Op.like]: `%${q.productcode}%` } : {[Op.regexp]: '^'},
                        }                                
                    },
                    {
                        model: db.Category,
                        as: 'category',
                        where:{
                            name: q.category? { [Op.like]: `%${q.category}%` } : {[Op.regexp]: '^'}
                        }                                
                    },
                ]
            })
            .then(products=>{
                db.Category.findAll()
                .then(categories=>{
                    objData = {products:products.rows, productsCount:products.count, categories:categories}
                    res.render('2_stores/products_index', objData);
                })
            })
        }
    },

    productsStatusChange: (req,res)=>{
        products = req.body.checked.toString().split(',');
        if(req.body.delete){
            for(var i = 0 ; i < products.length; i++){
                db.Product.findById(products[i])
                .then(product=>{
                    product.destroy();
                });
            };
        }
        else if(req.body.offSale){
            for(var i = 0 ; i < products.length; i++){
                db.Product.findById(products[i])
                .then(product=>{
                    product.update({
                        onSaleChk: false
                    }).then(()=>{});
                });
            };
        }
        else{
            for(var i = 0 ; i < products.length; i++){
                db.Product.findById(products[i])
                .then(product=>{
                    product.update({
                        onSaleChk: true
                    }).then(()=>{});
                });
            };
        }
        res.redirect('/stores/products');
    },

    productsShow: (req,res)=>{
        let objData = {
            product:req.product, 
            productcode:req.productcode, 
            myNations:req.nations, 
            myCities:req.cities, 
            tags:req.tags,
            category:req.category
        };
        
        db.Category.findAll()
        .then(categories=>{
            objData.categories = categories;
        });

        db.Nation.findAll({
            order: [
                ['nation', 'ASC'],
            ]
        })
        .then(nations=>{
            objData.nations = nations;
        });

        db.City.findAll()
        .then(cities=>{
            objData.cities = cities;
            res.render('2_stores/products_show', objData);
        });
        
        
    },
    
    productsUpdate: (req,res)=>{
        req.product.update(req.product)
        .then(()=>{
            req.session.alert = '수정되었습니다.'
            res.redirect(`/stores/products/${req.product.id}`);
        });
    },

    //products - add
    productsAdd: (req,res)=>{
        let objData = {};

        today = new Date();
        objData.today = today.yyyymmdd();

        db.Category.findAll()
        .then(categories=>{
            objData.categories = categories;
        });

        db.Nation.findAll({
            order: [
                ['nation', 'ASC'],
            ]
        })
        .then(nations=>{
            objData.nations = nations;
        });

        db.City.findAll({
            order: [
                'id'
            ]
        })
        .then(cities=>{
            objData.cities = cities;
            res.render("2_stores/products_add", objData);
        });
    },

    productsCreate: (req,res)=>{
        //store = res.locals.store.id
        //provider = req.user.id와 연결된 provider
        
        res.render("2_stores/products_add_completed");
    },
    
    productsGetProductcode: (req,res)=>{
        db.Productcode.findOne({
            where: {
                usedChk: false
            }
        })
        .then(productcode=>{
            console.log(productcode);
            res.json(productcode);
        });        
    },

    productsUpdateNation: (req,res)=>{
        // console.log('\n\n\n****',req.query);
        db.Nation.findOne({
            where: {
                id: req.query.nation
            }
        })
        .then(nation=>{

            db.City.findAll({
                include: [
                    {
                        model: db.Nation,
                        as: 'nation',
                        where: {
                            id: req.query.nation
                        }
                    }
                ]
            })
            .then(cities=>{
                let obj = {nation,cities};
                res.json(obj);
            });            
        });        
    },

    productsUpdateCity: (req,res)=>{
        console.log('\n\n\n****',req.query);
        db.City.findOne({
            where: {
                id: req.query.city
            }
        })
        .then(city=>{
            console.log(city);
            res.json(city);
        });         
    },

    productsGetUnavailables: (req,res)=>{

    },

    //stores - delete
    productsDelete: (req,res)=>{
        req.product.destroy();
        res.redirect('/stores/products');
    },

    findPost: (req,res,next)=>{
        db.Post.findById(req.params.post_id)
        .then(post=>{
            if(!post){
                req.flash('error', '없는 포스트입니다.');
                res.redirect('/stores/posts');
            }
            req.post = post;

            post.getAuthor()
            .then(author=>{
                req.author=author;
            })

            // post.getCategory()
            // .then(category=>{
            //     req.category = category;
            // })

            post.getStore()
            .then(store=>{
                req.store = store;
                next();
            })
        });
    },

    postsIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page;
        console.log('\n\n\n****', q);
        if(Object.keys(req.query).length === 0){
            db.Post.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    noticeChk: false
                },
                include: [
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    }
                ]
            })
            .then(posts=>{
                objData = {posts:posts.rows, postsCount:posts.count}
                res.render('2_stores/posts_index', objData);
            });   
        }      
        else{
            db.Post.findAndCountAll({
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
                        { title: q.title? { [Op.like]: `%${q.title}%` } : {[Op.regexp]: '^'}},
                        { content: q.content? { [Op.like]: `%${q.content}%` } : {[Op.regexp]: '^'}},
                        { noticeChk: false}
                    ]   
                    //스토어url, 제목,내용 (association included)                
                },
                include:[
                    {
                        model: db.Store,
                        as: 'store',
                        foreignKey: 'storeId',
                        where:{
                            id: res.locals.store.id,
                        }                                
                    }
                ]
            })
            .then(posts=>{
                console.log(posts, posts.rows[0]);
                objData = {posts:posts.rows, postsCount:posts.count}
                res.render('2_stores/posts_index', objData);
            })
        }
    },

    postsMultipleDelete: (req,res)=>{       
        posts = req.body.checked.toString().split(',');
        for(var i = 0 ; i < posts.length; i++){
            db.Post.findById(posts[i])
            .then(post=>{
                post.destroy();
            });
        };
        res.redirect('/stores/posts');
    },

    postsShow: (req,res)=>{
        let objData = {post:req.post,store:req.store,
            author:req.author}
        res.render('2_stores/posts_show', objData);
    },
    
    postsUpdate: (req,res)=>{
        req.post.update(req.body)
        .then(()=>{
            res.redirect(`/stores/posts/${req.post.id}`);
        });
    },
    
    //stores - delete
    postsDelete: (req,res)=>{
        req.post.destroy();
        res.redirect('/stores/posts');
    },

    findMessage: (req,res,next)=>{
        db.Message.findById(req.params.message_id)
        .then(message=>{
            if(!message){
                req.flash('error', '없는 메시지입니다.');
                res.redirect('/members/messages');
            }
            req.message = message;

            message.getSentMessages()
            .then(sentMessages =>{
                receivers = [];
                req.sentMessages=sentMessages;
                // console.log('\n\n\n***',sentMessages.length);
                db.User.findById(sentMessages[0].senderId)
                .then(sender=>{
                    // console.log('first sync');
                    req.sender = sender;
                });
                
               
                for(var i = 0 ; i < sentMessages.length ; i++){
                // console.log('in loop',i);
                    db.User.findById(sentMessages[i].receiverId)
                    .then(receiver =>{
                        receivers.push(receiver);
                    // console.log('loop sync',i);//어차피 다 돌고 난 이후니깐 계속 i 는 length와 동일
                    });
                }
                
            })
            .then(()=>{
                setTimeout(function() {
                    req.receivers = receivers;
                    console.log(req.receivers, req.sender);
                    next();
                  }, 300);
                
            });           
        });
    },

    messagesReceivedIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page; 
        if(Object.keys(req.query).length === 0){
            db.Message.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.Sentmessage,
                        as: 'sentMessages',
                        include :[
                            {
                                model:db.User,
                                as: 'receiver',
                                where: {
                                    id: res.locals.user.id
                                }
                            }
                        ]                        
                    }
                ]
            })
            .then(messages=>{
                objData = {messages:messages.rows, messagesCount:messages.count}
                res.render('2_stores/messages_received_index', objData);
            });   
        }      
        else{
            db.Message.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where:{
                    [Op.and]:
                    [
                        {createdAt: {
                            [Op.and]:[
                                {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                {deletedAt: null}
                            ]
                            }
                        }
                    ]   
                    //sentmessage의 아이디, 닉네임 / 스토어주소, 사업자명               
                },
                //user(sender), provider()
                include: [
                    {
                        model: db.Sentmessage,
                        as: 'sentMessages',
                        include: [
                            {
                                model: db.User,
                                as: 'sender',
                                where: {
                                    [Op.and]:
                                    [
                                        {username:{ [Op.like]: `%${q.username}%`}},
                                        {nickname:{ [Op.like]: `%${q.nickname}%`}},
                                        {deletedAt: null}
                                    ]
                                },
                                // include: [
                                //     {
                                //         model: db.Provider,
                                //         as: 'user',
                                //         where: {
                                //             companyName:{ [Op.like]: `%${q.companyName}%`},
                                //         },
                                //         include: [
                                //             {
                                //                 model: db.Store,
                                //                 as: 'stores',
                                //                 where: {
                                //                     url:{ [Op.like]: `%${q.url}%`},
                                //                 }
                                //             }
                                //         ]
                                //     },
                                    
                                // ]
                            }
                        ]

                    }
                ]
            })
            .then(messages=>{
                console.log(messages);
                objData = {messages:messages.rows, messagesCount:messages.count}
                res.render('2_stores/messages_received_index', objData);
            })
        }
    },

    messagesSentIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page; 
        if(Object.keys(req.query).length === 0){
            db.Message.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.Sentmessage,
                        as: 'sentMessages',
                        include :[
                            {
                                model:db.User,
                                as: 'sender',
                                where: {
                                    id: res.locals.user.id
                                }
                            }
                        ]                        
                    }
                ]
            })
            .then(messages=>{
                objData = {messages:messages.rows, messagesCount:messages.count}
                res.render('2_stores/messages_sent_index', objData);
            });   
        }      
        else{
            db.Message.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where:{
                    [Op.and]:
                    [
                        {createdAt: {
                            [Op.and]:[
                                {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                {deletedAt: null}
                            ]
                            }
                        }
                    ]   
                    //sentmessage의 아이디, 닉네임 / 스토어주소, 사업자명               
                },
                //user(sender), provider()
                include: [
                    {
                        model: db.Sentmessage,
                        as: 'sentMessages',
                        include: [
                            {
                                model: db.User,
                                as: 'sender',
                                where: {
                                    [Op.and]:
                                    [
                                        {username:{ [Op.like]: `%${q.username}%`}},
                                        {nickname:{ [Op.like]: `%${q.nickname}%`}},
                                        {deletedAt: null}
                                    ]
                                },
                                // include: [
                                //     {
                                //         model: db.Provider,
                                //         as: 'user',
                                //         where: {
                                //             companyName:{ [Op.like]: `%${q.companyName}%`},
                                //         },
                                //         include: [
                                //             {
                                //                 model: db.Store,
                                //                 as: 'stores',
                                //                 where: {
                                //                     url:{ [Op.like]: `%${q.url}%`},
                                //                 }
                                //             }
                                //         ]
                                //     },
                                    
                                // ]
                            }
                        ]

                    }
                ]
            })
            .then(messages=>{
                console.log(messages);
                objData = {messages:messages.rows, messagesCount:messages.count}
                res.render('2_stores/messages_sent_index', objData);
            })
        }
    },
    
    messagesMultipleDelete: (req,res)=>{       
        messages = req.body.checked.toString().split(',');
        for(var i = 0 ; i < messages.length; i++){
            db.Message.findById(messages[i])
            .then(message=>{
                message.destroy();
            });
        };
        res.redirect('/stores/messages');
    },

    messagesShow: (req,res)=>{
        //content
        res.render('2_stores/messages_show', {
            message: req.message,
            sender: req.sender,
            receivers: req.receivers
        })
        //receivers

    },

    messagesShowReceivers: (req,res)=>{
        //content
        res.render('2_stores/messages_receivers_show', {
            receivers: req.receivers
        })
        //receivers

    },
    //stores - delete
    messagesDelete: (req,res)=>{
        // req.message.destroy();
        if(req.sentMessages.senderId === req.user.id){
            for(var i = 0 ; i < req.sentMessage.length ; i++){
                req.sentMessages[i].update({
                    senderDel: true
                })
            }
        }else{
            req.sentMessages.update({
                receiverDel: true
            })
        }
       
        res.redirect('/stores/messages');
    },

    findComment: (req,res,next)=>{
        db.Comment.findById(req.params.comment_id)
        .then(comment=>{
            if(!comment){
                req.flash('error', '없는 댓글입니다.');
                res.redirect('/members/comments');
            }
            req.comment = comment;
            
            comment.getPost()
            .then(post=>{
                req.post = post;
            });

            comment.getAuthor()
            .then(author=>{
                req.author = author;
                next();
            });
        });
    },
    
    commentsIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page; 
        if(Object.keys(req.query).length === 0){
            db.Commenta.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(comments=>{
                objData = {comments:comments.rows, commentsCount:comments.count};
                res.render('2_stores/commentas_index', objData);
            });   
        }      
        else{
            db.Commenta.findAndCountAll({
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
                        {content: { [Op.like]: `%${q.content}%`}}
                    ]                    
                },
                include: [//provider 의 id, 사업자명, 회원유형
                    {
                        model: db.User,
                        as: 'author',
                        where: {
                            [Op.and]:
                            [
                                {username:{ [Op.like]: `%${q.username}%`}},
                                {nickname:{ [Op.like]: `%${q.nickname}%`}},
                            
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
            .then(comments=>{
                objData = {comments:comments.rows, comments:comments.count}
                res.render('2_stores/commentas_index', objData);
            })
        }
    },

    commentsMultipleDelete: (req,res)=>{       
        comments = req.body.checked.toString().split(',');
        for(var i = 0 ; i < comments.length; i++){
            db.Commentas.findById(comments[i])
            .then(comments=>{
                comments.destroy();
            });
        };
        res.redirect('/stores/comments');
    },

    commentsShow: (req,res)=>{
        objData = {
            comment: req.comment,
            post: req.post,
            author: req.author
        }
        res.render('2_stores/commentas_show.handlebars',objData);
    },
    //stores - delete
    commentsDelete: (req,res)=>{
        req.comment.destroy();
        res.redirect('/stores/messages');
    },
    
    findNotice: (req,res,next)=>{
        db.Post.findById(req.params.notice_id)
        .then(notice=>{
            if(!notice){
                req.flash('error', '없는 공지입니다.');
                res.redirect('/stores/notices');
            }
            req.notice = notice;

            notice.getAuthor()
            .then(author=>{
                req.author =author;
            });

            notice.getStore()
            .then(store=>{
                req.store = store;
                next();
            })
            

        });
    },

    noticesIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page; 
       if(Object.keys(req.query).length === 0){
            db.Post.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    noticeChk: true
                },
                include: [
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    }
                ]
            })
            .then(notices=>{
                objData = {notices:notices.rows, noticesCount:notices.count};
                res.render('2_stores/notices_index', objData);
            });   
        }      
        else{
            db.Post.findAndCountAll({
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
                        { title: q.title? { [Op.like]: `%${q.title}%` } : {[Op.regexp]: '^'}},
                        { content: q.content? { [Op.like]: `%${q.content}%` } : {[Op.regexp]: '^'}},
                        {noticeChk: true}
                    ]                    
                },
                include: [
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    }
                ]
            })
            .then(notices=>{
                objData = {notices:notices.rows, noticesCount:notices.count};
                res.render('2_stores/notices_index', objData);
            })
        }
    },

    noticesMultipleDelete: (req,res)=>{       
        notices = req.body.checked.toString().split(',');
        for(var i = 0 ; i < notices.length; i++){
            db.Commentas.findById(notices[i])
            .then(notices=>{
                notices.destroy();
            });
        };
        res.redirect('/stores/notices');
    },

    noticesShow: (req,res)=>{
        objData = {notice: req.notice, author:req.author, store:req.store}
        res.render('2_stores/notices_show',objData);
    },

    noticesUpdate: (req,res)=>{
        console.log('\n\n\n\n****',req.body);
        req.notice.update(req.body)
        .then((()=>{
            req.session.alert = '수정되었습니다.'
            res.redirect(`/stores/notices/${req.notice.id}`);
        }));
    },
    //stores - delete
    noticesDelete: (req,res)=>{
        req.notice.destroy();
        res.redirect('/stores/notices');
    }
}