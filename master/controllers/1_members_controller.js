// const express = require('express');
// const route = express.Router();
const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
// const queryString = require('query-string');

module.exports = {
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
        console.log('\n\n\n\n*******\n\n',req.query);
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
                    [Op.or]:[
                        {
                            createdAt: {
                                [Op.gte]: q.startdate ? q.startdate : null,
                                [Op.lte]: q.enddate ? q.enddate : null,
                            }
                        },
                        {
                            username: q.username 
                            // q.username ? ["username = ?", q.username] : null
                            // username: q.username
                        },
                        {
                            nickname: q.nickname
                            // nickname: q.nickname ? ["username = ?", q.nickname] : null
                        },
                        {
                            recEmail: q.recEmail
                        },
                        {
                            recSMS: q.recSMS
                        }
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
        }))
    },
    //users - delete
    usersDelete: (req,res)=>{
        req.user.destroy();
        res.redirect('/members/users');
    },
    //users - send messages
    //공통인데 어떻게 구현할지 생각해보자. 

    //providers - index
    providersIndex: (req,res)=>{
        res.render('1_members/providers_index');
    },
    //providers - search
    providersSearch: (req,res)=>{
        console.log("aa");
    },
    //providers - create
    providersCreate: (req,res)=>{
        ;
    },
    //providers - show
    rprovidersShow: (req,res)=>{
        res.render('1_members/providers_show');
    },
    //providers - edit
    providersEdit: (req,res)=>{
        res.render('1_members/providers_edit');
    },
    //providers - update
    providersUpdate: (req,res)=>{
        ;
    },
    //providers - delete
    providersDelete: (req,res)=>{
        
    },
    //providers - send messages

    //stores - index
    storesIndex: (req,res)=>{
        res.render('1_members/stores_index');
    },
    //stores - search
    storesSearch: (req,res)=>{
        
    },
    //stores - show
    storesShow: (req,res)=>{
        res.render('1_members/stores_show');
    },
    //stores - edit
    storesEdit: (req,res)=>{
        res.render('1_members/stores_edit');
    },
    //stores - update
    storesUpdate: (req,res)=>{
        
    },
    //stores - delete
    storesDelete: (req,res)=>{
        
    }
}