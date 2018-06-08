const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op

module.exports = {
    findProduct: (req,res,next)=>{
        db.Product.findById(req.params.product_id)
        .then(product=>{
            if(!product){
                req.flash('error', '없는 상품입니다.');
                res.redirect('/stores/products');
            }
            req.product = product;
            next();
        });
    },

    productsIndex: (req,res)=>{
        if(Object.keys(req.query).length === 0){
            db.Product.findAll()
            .then(products=>{
                res.render('3_stores/products_index', {products});
            });   
        }      
        else{
            let q = req.query;
            db.Product.findAll({
                where:{
                    [Op.or]:
                    [
                        {createdAt: {
                                [Op.gte]: q.startdate ? q.startdate : null,
                                [Op.lte]: q.enddate ? q.enddate : null,
                            }
                        },
                        { onSaleChk: q.onSaleChk },
                        { onDisplayChk: q.onDisplayChk },
                    ]   
                    //상품코드, category (association included)                
                }
            })
            .then(products=>{
                res.render('3_stores/products_index', {products});
            })
        }
    },

    productsShow: (req,res)=>{
        res.render('3_stores/products_show', {product:req.product, today:Date.now()});
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
            next();
        });
    },

    postsIndex: (req,res)=>{
        if(Object.keys(req.query).length === 0){
            db.Post.findAll()
            .then(posts=>{
                res.render('3_stores/posts_index', {posts});
            });   
        }      
        else{
            let q = req.query;
            db.Post.findAll({
                where:{
                    [Op.or]:
                    [
                        {createdAt: {
                                [Op.gte]: q.startdate ? q.startdate : null,
                                [Op.lte]: q.enddate ? q.enddate : null,
                            }
                        },
                        { title: q.title },
                        { content: q.content },
                    ]   
                    //스토어url, 제목,내용 (association included)                
                }
            })
            .then(posts=>{
                res.render('3_stores/posts_index', {posts});
            })
        }
    },

    postsShow: (req,res)=>{
        res.render('3_stores/posts_show', {post:req.post, today:Date.now()});
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
            //req.senders, req.receivers
            next();
        });
    },

    messagesIndex: (req,res)=>{
        if(Object.keys(req.query).length === 0){
            db.Message.findAll()
            .then(messages=>{
                res.render('3_stores/messages_index', {messages});
            });   
        }      
        else{
            let q = req.query;
            db.Message.findAll({
                where:{
                    [Op.or]:
                    [
                        {createdAt: {
                                [Op.gte]: q.startdate ? q.startdate : null,
                                [Op.lte]: q.enddate ? q.enddate : null,
                            }
                        }
                    ]   
                    //sentmessage의 아이디, 닉네임 / 스토어주소, 사업자명               
                }
            })
            .then(posts=>{
                res.render('3_stores/messages_index', {messages});
            })
        }
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
        .then(message=>{
            if(!message){
                req.flash('error', '없는 유저입니다.');
                res.redirect('/members/comments');
            }
            req.comment = comment;
            next();
        });
    },
    commentsIndex: (req,res)=>{

    },

    commentsShow: (req,res)=>{

    },
    commentsUpdate: (req,res)=>{
        
    },
    //stores - delete
    commentsDelete: (req,res)=>{
        
    },
    
    findNotice: (req,res,next)=>{
        db.Post.findById(req.params.notice_id)
        .then(notice=>{
            if(!notice){
                req.flash('error', '없는 공지입니다.');
                res.redirect('/stores/notices');
            }
            req.notice = notice;
            next();
        });
    },

    noticesIndex: (req,res)=>{
       if(Object.keys(req.query).length === 0){
            db.Post.findAll({
                where: {
                    noticeChk: true
                }
            })
            .then(notices=>{
                console.log(notices);
                res.render('3_stores/notices_index', {notices});
            });   
        }      
        else{
            let q = req.query;
            db.Post.findAll({
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
                        { url: q.url },
                        { companyName: q.companyName }
                    ]                    
                }
            })
            .then(notices=>{
                res.render('3_stores/notices_index', {notices});
            })
        }
    },

    noticesShow: (req,res)=>{
        res.render('3_stores/notices_show',{notice:req.notice});
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