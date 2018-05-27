const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op

module.exports = {
    findStore: (req,res,next)=>{
        db.Store.findById(req.params.store_id)
        .then(store=>{
            if(!store){
                req.flash('error', '없는 유저입니다.');
                res.redirect('/members/stores');
            }
            req.store = store;
            next();
        });
    },
    storesIndex: (req,res)=>{

    },

    storesShow: (req,res)=>{

    },
    storesUpdate: (req,res)=>{
        
    },
    //stores - delete
    storesDelete: (req,res)=>{
        
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
    messageIndex: (req,res)=>{

    },

    messageShow: (req,res)=>{

    },
    messageUpdate: (req,res)=>{
        
    },
    //stores - delete
    messageDelete: (req,res)=>{
        
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
        
    }
    
}