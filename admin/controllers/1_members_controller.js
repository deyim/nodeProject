const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 10;
const dateFunctions = require('../../lib/date_functions');

var makeObj = (user)=>{
    return new Promise (resolve=>{
        db.Order.findAndCountAll({
            include: [
                {
                   model: db.User,
                   as: 'buyer',
                   where: {
                       id: user.id
                   }
                }
            ]
        })
        .then(orders=>{
            console.log('\n\n\n\n****', user);
            user.ordersCnt = orders.count;
        });
    });    
}

async function usersToArray(users){
    var usersArray =[];
    for( var i = 0 ; i < users.count ; i++){
        var user = users.rows[i].dataValues;
        await makeObj(user);
        usersArray.push(user);
        console.log('\n\n\n\n******',user);
    }
    var myObj = {users:usersArray, userCount:users.count};
    return myObj;
}

module.exports = {
     /***********************
          members/common
    ***********************/

    sendMessages: (req,res)=>{
        let receivers = req.body.checked? req.body.checked.toString().split(',') : [];
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
                    model: db.Post,
                    as: 'posts',
                    required:false,
                    where: {
                        storeId: res.locals.store.id
                    }
                },
                {
                    model: db.Order,
                    as: 'orders',
                    required: false,
                    where: {
                        storeId: res.locals.store.id
                    }
                },
                {
                    model: db.Comment,
                    as: 'comments',
                    required: false,
                    where: {
                        storeId: res.locals.store.id
                    }
                },
                {
                    model: db.Store,
                    as: 'stores',
                    through: { 
                        where: {storeId: res.locals.store.id},
                        attributes: ['createdAt','orderCnt']
                    },
                },
            ]
        }).then(user=>{
            console.log(user);
            req.user = user;
            req.orders = user.orders? user.orders.length : 0;
            req.posts = user.posts? user.posts.length : 0;
            req.comments = user.comments? user.comments.length : 0;
            next();
        });
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
                offset: perPage*(page-1),
                where: {
                    userStatus: 'U'
                },
                include:[
                    {
                        model: db.Store,
                        as: 'stores',
                        required: true,
                        through: { 
                            where: {storeId: res.locals.store.id},
                            attributes: ['createdAt','orderCnt']
                        },
                    },
                ]
            })
            .then(users=>{
                objData = {users:users.rows, usersCount: users.count, firstday, q}
                res.render('1_members/users_index', objData);                           
            });   
        }      
        else{          
            db.User.findAndCountAll({
                where:{
                    [Op.and]:
                    [
                        {username: { [Op.like]: `%${q.username}%` }},
                        {nickname: { [Op.like]: `%${q.nickname}%` }},
                        {userStatus: 'U'}
                    ]                    
                },
                include:{
                    model: db.Store,
                    as: 'stores',
                    where: {
                        id: res.locals.store.id,
                    },
                    through: {
                        createdAt: {
                            [Op.and]:[
                                {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                           ]
                        }
                    },
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
        console.log('\n\n***', req.posts);
        dataobj = {user:req.user, posts:req.posts, orders:req.orders, comments:req.comments, createdAt:req.createdAt};
        res.render('1_members/users_show', dataobj);
    },   

    //users - delete
    usersDelete: (req,res)=>{
        
        db.StoreUsers.destroy({
            where: {
                userId: req.params.user_id,
                storeId: res.locals.store.id
            }
        })
        .then(()=>{
            res.redirect("/members/users");
        })
    },
    
}