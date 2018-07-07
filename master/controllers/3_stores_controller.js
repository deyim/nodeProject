const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op;
const perPage = 5;
const dateFunctions = require('../../lib/date_functions');

module.exports = {
    findProduct: (req,res,next)=>{
        db.Product.find({
            where: {
                id: req.params.product_id
            },
            include: [
                {
                    model: db.Productcode,
                    as: 'productcode'
                },
                {
                    model: db.Store,
                    as: 'store'
                },
                {
                    model: db.Provider,
                    as: 'provider',
                    include: [
                        {
                            model: db.User,
                            as: 'user'
                        }
                    ]
                },
                {
                    model: db.Category,
                    as: 'category'
                },
                {
                    model: db.Tag,
                    as: 'tags'
                },
                {
                    model: db.Nation,
                    as: 'nations'
                },
                {
                    model: db.City,
                    as: 'cities'
                }
            ]
        }).then(product=>{
            req.product = product;
            next();
        });
    },

    productsIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;    
        let categories;
        db.Category.findAll()
        .then(categories_=>{
            categories = categories_;
        });
        if(Object.keys(req.query).length === 0){
            db.Product.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.Store,
                        as: 'store'
                    },
                    {
                        model: db.Category,
                        as: 'category'
                    },
                    {
                        model: db.Productcode,
                        as: 'productcode'
                    },
                ]
            })
            .then(products=>{
                objData = {products:products.rows, productsCount:products.count, firstday, categories, q}
                res.render('3_stores/products_index', objData);
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
                            name: q.category? { [Op.like]: `%${q.category}%` } : {[Op.regexp]: '^'},
                        }                                
                    },
                    {
                        model: db.Store,
                        as: 'store'
                    }
                ]
            })
            .then(products=>{
                objData = {products:products.rows, productsCount:products.count, firstday, categories, q}
                res.render('3_stores/products_index', objData);
            })
        }
    },

    productsStatusChange: (req,res)=>{
        products = req.body.checked.toString().split(',');
        if(req.body.offDisplay){
            for(var i = 0 ; i < products.length; i++){
                db.Product.findById(products[i])
                .then(product=>{
                    product.update({
                        onDisplayChk: false
                    }).then(()=>{});
                });
            };
        }
        else if(req.body.onDisplay){
            for(var i = 0 ; i < products.length; i++){
                db.Product.findById(products[i])
                .then(product=>{
                    product.update({
                        onDisplayChk: true
                    }).then(()=>{});
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
        let product = req.product;
        db.Category.findAll()
        .then(categories=>{
            res.render('3_stores/products_show', {product, categories});
        })
       
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
        db.Post.findOne({
            where:{
                id: req.params.post_id
            },
            include:[
                {
                    model: db.Store,
                    as: 'store'
                },
                {
                    model: db.User,
                    as: 'author'
                }
            ]
        }).then((post)=>{
            req.post = post;
            next();
        });
    },

    postsIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;
        if(Object.keys(req.query).length === 0){
            db.Post.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    noticeChk: false
                },
                include: [
                    {
                        model: db.User,
                        as: 'author',
                        foreignKey: 'authorId'
                    },
                    {
                        model: db.Store,
                        as: 'store'
                    }
                ]
            })
            .then(posts=>{
                objData = {posts:posts.rows, postsCount:posts.count, firstday, q}
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
                            [Op.and]:
                            [
                                {url: q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'}},
                            ]
                        }                                
                    },
                    {
                        model: db.User,
                        as: 'author',
                        foreignKey: 'authorId'
                    }
                ]
            })
            .then(posts=>{
                objData = {posts:posts.rows, postsCount:posts.count, firstday, q}
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
        req.post.update(req.body)
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
       db.Messages.findOne({
           where: {
               id: req.params.message_id
           },
           include: [
               {
                   model: db.Sentmessage,
                   as: 'sentMessages',
                   foreignKey: 'messageId',
                   include: [
                       {
                           model: db.User,
                           as: "sender"
                       },
                       {
                           model: db.User,
                           as: "receivers"
                       },
                   ]
               }
           ]
       }).then((message)=>{
           req.message = message;
           next();
       });       
    },

    messagesIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page; 
        if(Object.keys(req.query).length === 0){
            db.Message.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    storeChk: true
                },
                include: [
                    {
                        model: db.Sentmessage,
                        as: 'sentMessages',
                        foreignKey: 'messageId',
                        include: [
                            {
                                model: db.User,
                                as: "sender",
                                include: [
                                    {
                                        model: db.Provider,
                                        as: 'provider',
                                        include: [
                                            {
                                                model: db.Store,
                                                as: 'store'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                model: db.User,
                                as: "receiver"
                            },
                        ]
                    }
                ]
            })
            .then(messages=>{
                objData = {messages:messages.rows, messagesCount:messages.count, firstday, q}
                res.render('3_stores/messages_index', objData);
            });  
        }      
        else{
            console.log(q);
            db.Message.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where:{
                    storeChk: true,
                    createdAt: {
                        [Op.and]:[
                            {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                            {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                            {deletedAt: null}
                        ]
                    }
                    //sentmessage의 아이디, 닉네임 / 스토어주소, 사업자명               
                },
                //user(sender), provider()
                include: [
                    {
                        model: db.Sentmessage,
                        as: 'sentMessages',
                        foreignKey: 'messageId',
                        include: [
                            {
                                model: db.User,
                                as: 'sender',
                                where: {
                                    [Op.and]:
                                    [
                                        {username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'}},
                                        {nickname: q.nickname? { [Op.like]: `%${q.nickname}%` } : {[Op.regexp]: '^'}},
                                    ]
                                },
                                // include: [
                                //     {
                                //         model: db.Provider,
                                //         as: 'provider',
                                //         where: {
                                //             companyName: q.companyName? { [Op.like]: `%${q.companyName}%` } : {[Op.regexp]: '^'},
                                //         },
                                //         include: [
                                //             {
                                //                 model: db.Store,
                                //                 as: 'store',
                                //                 where: {
                                //                     url: q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'},
                                //                 }
                                //             }
                                //         ]
                                //     },
                                    
                                // ]
                            },
                            {
                                model: db.User,
                                as: "receiver"
                            },
                        ]
                    },
                   
                ]
            })
            .then(messages=>{
                console.log(messages);
                objData = {messages:messages.rows, messagesCount:messages.count, firstday, q}
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

    messagesUsersIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page; 
        if(Object.keys(req.query).length === 0){
            db.Message.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    storeChk: false
                },
                include: [
                    {
                        model: db.Sentmessage,
                        as: 'sentMessages',
                        foreignKey: 'messageId',
                        include: [
                            {
                                model: db.User,
                                as: "sender",
                                include: [
                                    {
                                        model: db.Provider,
                                        as: 'provider',
                                        include: [
                                            {
                                                model: db.Store,
                                                as: 'store'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                model: db.User,
                                as: "receiver"
                            },
                        ]
                    }
                ]
            })
            .then(messages=>{
                objData = {messages:messages.rows, messagesCount:messages.count, firstday, q}
                res.render('3_stores/messages_users_index', objData);
            });  
        }      
        else{
            db.Message.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where:{
                    storeChk: false,
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
                                        {username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'}},
                                        {nickname: q.nickname? { [Op.like]: `%${q.nickname}%` } : {[Op.regexp]: '^'}},
                                        {deletedAt: null}
                                    ]
                                },
                                include: [
                                    {
                                        model: db.Provider,
                                        as: 'user',
                                        where: {
                                            companyName: q.companyName? { [Op.like]: `%${q.companyName}%` } : {[Op.regexp]: '^'},
                                        },
                                        include: [
                                            {
                                                model: db.Store,
                                                as: 'stores',
                                                where: {
                                                    url: q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'},
                                                }
                                            }
                                        ]
                                    },
                                    
                                ]
                            }
                        ]

                    }
                ]
            })
            .then(messages=>{
                objData = {messages:messages.rows, messagesCount:messages.count, firstday, q}
                res.render('3_stores/messages_users_index', objData);
            })
        }
    },

    messagesUsersMultipleDelete: (req,res)=>{       
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
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page; 

        let type={};
        if(q.type=='A'){
            type.model = db.Post;
            type.as = 'post';
            type.required = true;
        }
        else if(q.type=='B'){
            type.model = db.Post;
            type.as = 'post';
            type.where = {
                noticeChk: true
            };
            type.required = true;
        }
        else{
            type.model = db.Product;
            type.as = 'product';
            type.required = true;
        }
        console.log('\n\n\n',type);
        if(Object.keys(req.query).length === 0){
            db.Comment.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.User,
                        as: 'author',
                        foreignKey: 'authorId'
                    },
                ]
            })
            .then(comments=>{
                objData = {comments:comments.rows, commentsCount:comments.count, firstday, q};
                res.render('3_stores/comments_index', objData);
            });   
        }      
        else{
            db.Comment.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                // where:{
                //     [Op.and]:
                //     [
                //         {createdAt: {
                //                 [Op.and]:[
                //                     {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                //                     {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                //                 ]
                //             }
                //         },
                //         {content: q.content? { [Op.like]: `%${q.title}%` } : {[Op.regexp]: '^'}},
                //     ]                    
                // },
                // include: [//provider 의 id, 사업자명, 회원유형
                //     {
                //         model: db.User,
                //         as: 'author',
                //         where: {
                //             [Op.and]:
                //             [
                //                 {username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'}},
                //                 {nickname: q.nickname? { [Op.like]: `%${q.nickname}%` } : {[Op.regexp]: '^'}},
                //             ]
                //         },
                //     },
                //     {
                //         model: db.Product,
                //         as: 'product',
                //         required: true
                //     }
                //     // type
                // ]
            })
            .then(comments=>{
                objData = {comments:comments.rows, comments:comments.count, firstday, q}
                res.render('3_stores/comments_index', objData);
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
        db.Post.findOne({
            where: {
                id: req.params.notice_id,
                noticeChk: true
            },
            include: [
                {
                    model: db.User,
                    as: 'author'
                },
                {
                    model: db.Store,
                    as: 'store'
                },
            ]
        })
        .then(notice=>{
            req.notice = notice;
            next();
        })
    },

    noticesIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
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
                        as:'store'
                    }
                ]
            })
            .then(notices=>{
                objData = {notices:notices.rows, noticesCount:notices.count, firstday, q};
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
                objData = {notices:notices.rows, noticesCount:notices.count, firstday, q};
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
        objData = {notice:req.notice}
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