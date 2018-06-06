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

    },

    productsShow: (req,res)=>{

    },
    productsUpdate: (req,res)=>{
        
    },
    //stores - delete
    productsDelete: (req,res)=>{
        
    },

    findPost: (req,res,next)=>{
        db.Post.findById(req.params.post_id)
        .then(post=>{
            if(!post){
                req.flash('error', '없는 유저입니다.');
                res.redirect('/members/posts');
            }
            req.post = post;
            next();
        });
    },
    postsIndex: (req,res)=>{

    },

    postsShow: (req,res)=>{

    },
    postsUpdate: (req,res)=>{
        
    },
    //stores - delete
    postsDelete: (req,res)=>{
        
    },

    findMessage: (req,res,next)=>{
        db.Message.findById(req.params.message_id)
        .then(message=>{
            if(!message){
                req.flash('error', '없는 유저입니다.');
                res.redirect('/members/messages');
            }
            req.message = message;
            next();
        });
    },
    messagesIndex: (req,res)=>{

    },

    messagesShow: (req,res)=>{

    },
    messagesUpdate: (req,res)=>{
        
    },
    //stores - delete
    messagesDelete: (req,res)=>{
        
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
    noticesIndex: (req,res)=>{

    },

    noticesShow: (req,res)=>{

    },
    noticesUpdate: (req,res)=>{
        
    },
    //stores - delete
    noticesDelete: (req,res)=>{
        
    }
}