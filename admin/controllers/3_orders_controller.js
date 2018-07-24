const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 5;
const dateFunctions = require('../../lib/date_functions');

var makeObj = (order)=>{
    return new Promise (resolve=>{
        oneObj = new Object();
        
        oneObj.order = order;
        
        order.getProduct()
        .then(product=>{
            oneObj.product = product;
        });
        
        order.getOrdercode()
        .then(code=>{
            oneObj.ordercode = code; 
        });

        order.getServiceUsers()
        .then(users=>{
            oneObj.serviceUsers = users;
        })

        order.getStore()
        .then(store=>{
            oneObj.store =store;
        });
        
        order.getBuyer()
        .then(buyer=>{
            oneObj.buyer =buyer;

        });

        setTimeout(()=>{
            resolve(oneObj);
        },300)
    })
    
}
async function ordersToArray(orders){
    var ordersArray = [];

    for(var i = 0 ; i < orders.count ; i++){
        const myObj = await makeObj(orders.rows[i]);
        ordersArray.push(myObj);
    }    

    var myObj = {orders:ordersArray, ordersCount:orders.count};
    return myObj;

};

var paidChkChangePromise = (i)=>{
    db.OrderStatus.findOne({
        include: [
            {
                model: db.Order,
                required: true,
                as: 'order',
                where: {
                    id: i
                }
            }
        ]
    })
    .then(orderstatus=>{
        orderstatus.update({
            paidChk: true
        }).then((orderstatus)=>{
            return new Promise ((resolve)=>{
            });
        });
    });     
}

var denyChkChangePromise = (i)=>{
    db.OrderStatus.findOne({
        include: [
            {
                model: db.Order,
                required: true,
                as: 'order',
                where: {
                    id: i
                }
            }
        ]
    })
    .then(orderstatus=>{
        orderstatus.update({
            denyChk: true
        }).then((status)=>{
            db.CancelRequest.create({
                orderId: i
            })
            .then(()=>{
                return new Promise ((resolve)=>{
                console.log(status);
                })
            });
        });
        
        
    });     
}

var cancelAllowPromise = (i)=>{
    db.OrderStatus.findOne({
        include: [
            {
                model: db.Order,
                required: true,
                as: 'order',
                where: {
                    id: i
                }
            }
        ]
    })
    .then(orderstatus=>{
        orderstatus.update({
            cancelChk: true
        }).then((orderstatus)=>{
            return new Promise ((resolve)=>{
            });
        });
    });     
}

var cancelDenyPromise = (i)=>{
    db.OrderStatus.findOne({
        include: [
            {
                model: db.Order,
                required: true,
                as: 'order',
                where: {
                    id: i
                }
            }
        ]
    })
    .then(orderstatus=>{
        orderstatus.update({
            cancelChk: false
        }).then((orderstatus)=>{
            return new Promise ((resolve)=>{
            });
        });
    });     
}

async function paidChkChange(orders){
    for(var i = 0 ; i < orders.length ; i++){
        await paidChkChangePromise(orders[i]);
    }    
};

async function denyChkChange(orders){
    for(var i = 0 ; i < orders.length ; i++){
        await denyChkChangePromise(orders[i]);
    }    
};

async function cancelAllow(orders){
    for(var i = 0 ; i < orders.length ; i++){
        await cancelAllowPromise(orders[i]);
    }    
};

async function cancelDeny(orders){
    for(var i = 0 ; i < orders.length ; i++){
        await cancelDenyPromise(orders[i]);
    }    
};



module.exports = {   
    orderServiceUsers: (req,res)=>{
        let order;
        db.Order.findOne({
            where: {
                id: req.params.order_id
            },
            include: [
                {
                    model: db.Product,
                    as: 'product'
                }
            ]
        })
        .then(order_=>{order=order_; })
        .then(()=>{
            db.ServiceUser.findAll({
                include: [
                    {
                        model: db.Order,
                        as: 'order',
                        where: {
                            id: req.params.order_id
                        }
                    }
                ]
            }).then(users=>{
                res.render('3_orders/order_service_users', {users, order});
            })
        })
        
    },

    orderedIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        let objData = {};
        console.log(q);
        if(Object.keys(req.query).length === 0){            
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: false, 
                            denyChk: false
                        }
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode'
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId',
                        required: false
                    },
                    {
                        model: db.Product,
                        as: 'product'
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        required: false
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('3_orders/ordered_index', objData);
            });       
        }      
        else{
            db.Order.findAndCountAll({
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
                    ]   
                    ///상품명, 주문번호, 주문자아이디, 판매스토어주소
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: false, 
                            denyChk: false
                        }
                    },
                    {
                        model: db.Product,
                        as: 'product',
                        where:{
                                title: q.title? { [Op.like]: `%${q.title}%` } : {[Op.regexp]: '^'},
                        },
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode',
                        where: {
                            code: q.ordercode? { [Op.like]: `%${q.ordercode}%` } : {[Op.regexp]: '^'}
                        }
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId',
                        required: false
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        where: {
                            korPhone: q.korPhone? { [Op.like]: `%${q.korPhone}%` } : {[Op.regexp]: '^'}, 
                        },
                        required: false
                    },
                    {
                        model: db.User,
                        as: 'buyer',
                        where: {
                            username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'},
                            name: q.name? { [Op.like]: `%${q.name}%` } : {[Op.regexp]: '^'},
                        }
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('3_orders/ordered_index', objData);
            });   
        }
    },

    orderedStatusChange: (req,res)=> {
        let orders = req.body.checked.toString().split(',');
      
        if(req.body.denyChk){
            denyChkChange(orders);
        }
        res.redirect('/orders/ordered');        
    },

    paidIndex: (req,res)=>{
        // console.log('************\n\n\n\n\n******',req.query);
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        let objData = {};
        if(Object.keys(req.query).length === 0){
            
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeDate: null
                        },
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode'
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId',
                        required: false
                    },
                    {
                        model: db.Product,
                        as: 'product'
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        required: false
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('3_orders/paid_index', objData);                    
            });   
        }      
        else{
            db.Order.findAndCountAll({
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
                    ]   
                    ///상품명, 주문번호, 주문자아이디, 판매스토어주소
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeDate: null
                        },
                    },
                    {
                        model: db.Product,
                        as: 'product',
                        where:{
                                title: q.title? { [Op.like]: `%${q.title}%` } : {[Op.regexp]: '^'}
                        },
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId',
                        required: false
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode',
                        where: {
                            code: q.ordercode? { [Op.like]: `%${q.ordercode}%` } : {[Op.regexp]: '^'}
                        }
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                    {
                        model: db.User,
                        as: 'buyer',
                        where: {
                            username: q.ordercode? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'}
                        }
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        where: {
                            korPhone: q.korPhone? { [Op.like]: `%${q.korPhone}%` } : {[Op.regexp]: '^'}, 
                        },
                        required: false
                    },
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('3_orders/paid_index', objData);                    
            }); 
        }
    },

    paidStatusChange: (req,res)=>{
        let orders = req.body.checked.toString().split(',');
        denyChkChange(orders);
        res.redirect('/orders/ordered');     
    },

    placedIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        let objData = {};
        if(Object.keys(req.query).length === 0){
            
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeDate: {
                                [Op.ne]: null
                            }
                        },
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode'
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId',
                        required: false
                    },
                    {
                        model: db.Product,
                        as: 'product'
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        required: false
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('3_orders/placed_index', objData);
            }); 
        }      
        else{
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where:{
                    [Op.and]:
                    [
                        // {startDate: {[Op.lte]: today}},
                        // {endDate: {[Op.gte]: limit}},
                        {createdAt: {
                            [Op.and]:[
                                {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                ]
                            }
                        },  
                    ]   
                    ///상품명, 주문번호, 주문자아이디, 판매스토어주소
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeDate: {
                                [Op.ne]: null
                            }
                        },
                    },
                    {
                        model: db.Product,
                        as: 'product',
                        where:{
                                title: q.title? { [Op.like]: `%${q.title}%` } : {[Op.regexp]: '^'}
                        },
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode',
                        where: {
                            code: q.ordercode? { [Op.like]: `%${q.ordercode}%` } : {[Op.regexp]: '^'}
                        }
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId',
                        required: false
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            url: q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'},
                            id: res.locals.store.id
                        }
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        where: {
                            korPhone: q.korPhone? { [Op.like]: `%${q.korPhone}%` } : {[Op.regexp]: '^'}, 
                        },
                        required: false
                    },
                    {
                        model: db.User,
                        as: 'buyer',
                        where: {
                            username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'},
                            name: q.name? { [Op.like]: `%${q.name}%` } : {[Op.regexp]: '^'},
                        }
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('3_orders/placed_index', objData);
            }); 
        }
    },

    usedIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        let objData = {};
        var limit = new Date();
        let today = new Date();
        limit.setDate(limit.getDate()+3);
        if(Object.keys(req.query).length === 0){
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    startDate: {[Op.lte]: today},
                    endDate: {[Op.gte]: limit},
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeChk: true,
                            denyChk: false                        
                        },
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode'
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId',
                        required: false
                    },
                    {
                        model: db.Product,
                        as: 'product'
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        required: false
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('3_orders/used_index', objData);
            }); 
        }      
        else{
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    startDate: {[Op.lte]: today},
                    endDate: {[Op.gte]: limit},
                },
                where:{
                    [Op.and]:
                    [
                        {startDate: {[Op.lte]: today}},
                        {endDate: {[Op.gte]: limit}},
                        {createdAt: {
                            [Op.and]:[
                                {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                ]
                            }
                        },  
                    ]   
                    ///상품명, 주문번호, 주문자아이디, 판매스토어주소
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeChk: true,
                            denyChk: false
                        },
                    },
                    {
                        model: db.Product,
                        as: 'product',
                        where:{
                                title: q.title? { [Op.like]: `%${q.title}%` } : {[Op.regexp]: '^'}
                        },
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode',
                        where: {
                            code: q.ordercode? { [Op.like]: `%${q.ordercode}%` } : {[Op.regexp]: '^'}
                        }
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId',
                        required: false
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        where: {
                            korPhone: q.korPhone? { [Op.like]: `%${q.korPhone}%` } : {[Op.regexp]: '^'}, 
                        },
                        required: false
                    },
                    {
                        model: db.User,
                        as: 'buyer',
                        where: {
                            username: q.ordercode? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'}
                        }
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('3_orders/used_index', objData);
            }); 
        }
    },

    finalIndex: (req,res)=>{
        // console.log('************\n\n\n\n\n******',req.query);
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        let objData = {};
        var limit = new Date();
        limit.setDate(limit.getDate()+3);
        if(Object.keys(req.query).length === 0){            
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    endDate: {[Op.lt]: limit},
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeChk: true,
                            finalChk: true
                        },
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode'
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId',
                        required: false
                    },
                    {
                        model: db.Product,
                        as: 'product'
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        required: false
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('3_orders/final_index', objData);
            }); 
        }      
        else{
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    endDate: {[Op.lte]: limit},
                    [Op.and]:
                    [
                        {createdAt: {
                            [Op.and]:[
                                {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                ]
                            }
                        },  
                    ]   
                    ///상품명, 주문번호, 주문자아이디, 판매스토어주소
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeChk: true,
                            finalChk: true
                         },
                    },
                    {
                        model: db.Product,
                        as: 'product',
                        where:{
                                title: q.title? { [Op.like]: `%${q.title}%` } : {[Op.regexp]: '^'}
                        },
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode',
                        where: {
                            code: q.ordercode? { [Op.like]: `%${q.ordercode}%` } : {[Op.regexp]: '^'}
                        }
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId',
                        required: false
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id,
                            url: q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'},
                        }
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        where: {
                            korPhone: q.korPhone? { [Op.like]: `%${q.korPhone}%` } : {[Op.regexp]: '^'}, 
                        },
                        required: false
                    },
                    {
                        model: db.User,
                        as: 'buyer',
                        where: {
                            username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'},
                            name: q.name? { [Op.like]: `%${q.name}%` } : {[Op.regexp]: '^'},
                        }
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('3_orders/final_index', objData);
            }); 
        }
    },

    cancelIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        let objData = {};
        if(Object.keys(req.query).length === 0){
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.CancelRequest,
                        as: 'cancelRequest',
                        required: true
                    },
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            cancelReqChk: true 
                        },
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode'
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId',
                        required: false
                    },
                    {
                        model: db.Product,
                        as: 'product'
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        required: false
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('3_orders/cancel_index', objData);
            });  
        }      
        else{
            db.Order.findAll({
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
                    ]   
                    ///상품명, 주문번호, 주문자아이디, 판매스토어주소
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            cancelReqChk: true
                        },
                    },
                    {
                        model: db.CancelRequest,
                        as: 'cancelRequest',
                        required: true
                    },
                    {
                        model: db.Product,
                        as: 'product',
                        where:{
                                title: q.title? { [Op.like]: `%${q.title}%` } : {[Op.regexp]: '^'}
                        },
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode',
                        where: {
                            code: q.ordercode? { [Op.like]: `%${q.ordercode}%` } : {[Op.regexp]: '^'}
                        }
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId',
                        required: false
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        where: {
                            korPhone: q.korPhone? { [Op.like]: `%${q.korPhone}%` } : {[Op.regexp]: '^'}, 
                        },
                        required: false
                    },
                    {
                        model: db.User,
                        as: 'buyer',
                        where: {
                            username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'},
                            name: q.name? { [Op.like]: `%${q.name}%` } : {[Op.regexp]: '^'},
                        }
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('3_orders/cancel_index', objData);
            });  
        }
    },

    cancelStatusChange: (req,res)=>{
        let orders = req.body.checked.toString().split(',');
        if(req.body.cancelAllow){          
            cancelAllow(orders);
        }else if(req.body.cancelDeny){
            cancelDeny(orders);
        }
        res.redirect('/orders/cancel');  
    }
    // orderedShow: (req,res)=>{        
    //     res.render('3_orders/ordered_show', {order:req.order, today:Date.now()});
    // },


    // paidShow: (req,res)=>{
    //     res.render('3_orders/paid_show', {order:req.order, today:Date.now()});
    // },


    // placedShow: (req,res)=>{
    //     res.render('3_orders/used_show', {order:req.order, today:Date.now()});
    // },



    // usedShow: (req,res)=>{
    //     res.render('3_orders/used_show', {order:req.order, today:Date.now()});
    // },


    // finalShow: (req,res)=>{
    //     res.render('3_orders/final_show', {order:req.order, today:Date.now()});
    // },

    // cancelShow: (req,res)=>{
    //     res.render('3_orders/cancel_show', {order:req.order, today:Date.now()});
    // },
  

}