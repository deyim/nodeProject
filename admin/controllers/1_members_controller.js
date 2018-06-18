const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 10;

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

            user.getPosts({
                where: {
                    storeId: res.locals.store.id
                }
            })
            .then(posts=>{
                console.log('\n\n\n****',posts.length);
                req.posts = posts.length || 0;
            });
            
            user.getOrders({
                where: {
                    storeId: res.locals.store.id
                }
            })
            .then(orders=>{
                req.orders = orders.length || 0;                
            });

            db.StoreUsers.find({
                where: {
                    userId: user.id,
                    storeId: res.locals.store.id
                }
            }).then((asso)=>{
                req.createdAt = asso.createdAt
            })

            user.getCommentas({
                include: [
                    {
                        model: db.Post,
                        as: 'post',
                        include: [
                            {
                                model: db.Store,
                                as: 'store',
                                where: {
                                    id: res.locals.store.id
                                }
                            }
                        ]
                    }

                ]
            })
            .then(comments=>{
                console.log('\n\n***',comments);
                req.comments = comments.length || 0;
                next();}
            );
            
            
           
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
                offset: perPage*(page-1),
                where: {
                    userStatus: 'U'
                },
                include:{
                    model: db.Store,
                    as: 'stores',
                    where: {
                        id: res.locals.store.id,
                    },
                },
            })
            .then(users=>{
                res.render('1_members/users_index', {users:users.rows, usersCount: users.count});                
                // var myObj = usersToArray(users);
                // setTimeout(()=>{
                //     res.render('1_members/users_index', myObj);
                // },1000);                
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
                    throuth: {
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