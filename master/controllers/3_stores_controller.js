const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op;
const perPage = 5;

module.exports = {
    findProduct: (req,res,next)=>{
        db.Product.findById(req.params.product_id)
        .then(product=>{
            if(!product){
                req.flash('error', '없는 상품입니다.');
                res.redirect('/stores/products');
            }
            req.product = product;

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
                offset: perPage*(page-1)
            })
            .then(products=>{
                objData = {products:products.rows, productsCount:products.count}
                res.render('3_stores/products_index', objData);
            });   
        }      
        else{
            let q = req.query;
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
                        { title: { [Op.like]: `%${q.title}%` }},
                        { onSaleChk: q.onSaleChk ? q.onSaleChk : false},
                        { onDisplayChk: q.onDisplayChk ? q.onDisplayChk : false}
                    ],                                  
                },
                include:[
                    {
                        model: db.Productcode,
                        as: 'productcode',
                        where:{
                                code: { [Op.like]: `%${q.productcode}%` }
                        }                                
                    },
                    {
                        model: db.Category,
                        as: 'category',
                        where:{
                            name: { [Op.like]: `%${q.category}%` }
                        }                                
                    },
                ]
            })
            .then(products=>{
                objData = {products:products.rows, productsCount:products.count}
                res.render('3_stores/products_index', objData);
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
        objData = {
            product:req.product, 
            productcode:req.productcode, 
            nations:req.nations, 
            cities:req.cities, 
            tags:req.tags,
            category:req.category
        };
        res.render('3_stores/products_show', objData);
    },
    
    productsUpdate: (req,res)=>{
        req.product.update(req.product)
        .then(()=>{
            req.session.alert = '수정되었습니다.'
            res.redirect(`/stores/products/${req.product.id}`);
        });
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
        if(Object.keys(req.query).length === 0){
            db.Post.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    noticeChk: false
                }
            })
            .then(posts=>{
                objData = {posts:posts.rows, postsCount:posts.count}
                res.render('3_stores/posts_index', objData);
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
                        { title: { [Op.like]: `%${q.title}%` }}, 
                        { content: { [Op.like]: `%${q.content}%` }},
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
                            [Op.and]:
                            [
                                {url: { [Op.like]: `%${q.url}%` }},
                            ]
                        }                                
                    }
                ]
            })
            .then(posts=>{
                objData = {posts:posts.rows, postsCount:posts.count}
                res.render('3_stores/posts_index', objData);
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
        res.render('3_stores/posts_show', {post:req.post,store:req.store});
    },
    
    postsUpdate: (req,res)=>{
        req.post.update(req.post)
        .then(()=>{
            req.session.alert = '수정되었습니다.'
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
                console.log('\n\n\n***',sentMessages.length);
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

    messagesIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page; 
        if(Object.keys(req.query).length === 0){
            db.Message.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
            })
            .then(messages=>{
                objData = {messages:messages.rows, messagesCount:messages.count}
                res.render('3_stores/messages_index', objData);
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
                res.render('3_stores/messages_index', objData);
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
        res.render('3_stores/messages_show', {
            message: req.message,
            sender: req.sender,
            receivers: req.receivers
        })
        //receivers

    },
    //stores - delete
    messagesDelete: (req,res)=>{
        req.message.destroy();
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
                res.render('3_stores/commentas_index', objData);
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
                res.render('3_stores/commentas_index', objData);
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
        res.render('3_stores/commentas_show.handlebars',objData);
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
                }
            })
            .then(notices=>{
                objData = {notices:notices.rows, noticesCount:notices.count};
                res.render('3_stores/notices_index', objData);
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
                        {title: { [Op.like]: `%${q.title}%`}},
                        {content: { [Op.like]: `%${q.content}%`}},
                        {noticeChk: true}
                    ]                    
                },
                include: [
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            url: { [Op.like]: `%${q.url}%`}
                        }
                    }
                ]
            })
            .then(notices=>{
                objData = {notices:notices.rows, noticesCount:notices.count};
                res.render('3_stores/notices_index', objData);
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
        res.render('3_stores/notices_show',objData);
    },
    noticesUpdate: (req,res)=>{
        req.post.update(req.body)
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