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
        .then(order_=>{order=order_; console.log(order.product.title)})
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
                res.render('4_orders/order_service_users', {users, order});
            })
        })
        
    },
    
    orderedIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        
        if(Object.keys(req.query).length === 0){            
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: false 
                        }
                    },
                    {
                        model: db.Store,
                        as: 'store',
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode'
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId'
                    },
                    {
                        model: db.Product,
                        as: 'product'
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ]
            })
            .then(orders=>{
                console.log(orders);
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('4_orders/ordered_index', objData);
            })   
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
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: false 
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
                        foreignKey: 'orderId'
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            url: q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'},
                        }
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        where: {
                            korPhone: q.korPhone? { [Op.like]: `%${q.korPhone}%` } : {[Op.regexp]: '^'}, 
                        }
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
                console.log(orders);
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('4_orders/ordered_index', objData);
            })
        }
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
                            placeChk: false,
                        },
                    },
                    {
                        model: db.Store,
                        as: 'store',
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode'
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId'
                    },
                    {
                        model: db.Product,
                        as: 'product'
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('4_orders/paid_index', objData);
            })   
        }      
        else{
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeChk: false,
                        },
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
                        foreignKey: 'orderId'
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            url: q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'},
                        }
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        where: {
                            korPhone: q.korPhone? { [Op.like]: `%${q.korPhone}%` } : {[Op.regexp]: '^'}, 
                        }
                    },
                    {
                        model: db.User,
                        as: 'buyer',
                        where: {
                            username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'},
                            name: q.name? { [Op.like]: `%${q.name}%` } : {[Op.regexp]: '^'},
                        }
                    }
                ],
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
                }
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('4_orders/paid_index', objData);
            }) 
        }
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
                            placeChk: true,
                            // cancelChk: false,
                        },
                    },
                    {
                        model: db.Store,
                        as: 'store',
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode'
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId'
                    },
                    {
                        model: db.Product,
                        as: 'product'
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ]
            })
            .then(orders=>{
                console.log(orders);
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('4_orders/placed_index', objData);
            })   
        }      
        else{
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeChk: true,
                            // cancelChk: false
                        },
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
                        foreignKey: 'orderId'
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            url: q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'},
                        }
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        where: {
                            korPhone: q.korPhone? { [Op.like]: `%${q.korPhone}%` } : {[Op.regexp]: '^'}, 
                        }
                    },
                    {
                        model: db.User,
                        as: 'buyer',
                        where: {
                            username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'},
                            name: q.name? { [Op.like]: `%${q.name}%` } : {[Op.regexp]: '^'},
                        }
                    }
                ],
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
                },
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('4_orders/placed_index', objData);
            })  
        }
    },

    usedIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        let objData = {};
        let limit = new Date();
        let today = new Date();
        limit.setDate(limit.getDate()-3);
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
                            cancelChk: false,                        
                        },
                    },
                    {
                        model: db.Store,
                        as: 'store',
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode'
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId'
                    },
                    {
                        model: db.Product,
                        as: 'product'
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('4_orders/used_index', objData);
            }) 
        }      
        else{
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    endDate: {[Op.lte]: limit},
                },
                include: [{
                    model: db.OrderStatus,
                    as: 'orderStatus',
                    where: { 
                            paidChk: true,
                            placeChk: true,
                            cancelChk: false
                        },
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
                        foreignKey: 'orderId'
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            url: q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'},
                        }
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        where: {
                            korPhone: q.korPhone? { [Op.like]: `%${q.korPhone}%` } : {[Op.regexp]: '^'}, 
                        }
                    },
                    {
                        model: db.User,
                        as: 'buyer',
                        where: {
                            username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'},
                            name: q.name? { [Op.like]: `%${q.name}%` } : {[Op.regexp]: '^'},
                        }
                    }
                ],
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
                },
            })
            .then(orders=>{
                console.log(orders);
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('4_orders/used_index', objData);
            }) 
        }
    },

    finalIndex: (req,res)=>{
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
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode'
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId'
                    },
                    {
                        model: db.Product,
                        as: 'product'
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('4_orders/final_index', objData);
            }) 
        }      
        else{
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    endDate: {[Op.lte]: limit},
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
                        foreignKey: 'orderId'
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            url: q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'},
                        }
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        where: {
                            korPhone: q.korPhone? { [Op.like]: `%${q.korPhone}%` } : {[Op.regexp]: '^'}, 
                        }
                    },
                    {
                        model: db.User,
                        as: 'buyer',
                        where: {
                            username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'},
                            name: q.name? { [Op.like]: `%${q.name}%` } : {[Op.regexp]: '^'},
                        }
                    }
                ],
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
                },
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('4_orders/final_index', objData);
            }) 
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
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            cancelChk: true
                        },
                    },
                    {
                        model: db.Store,
                        as: 'store',
                    },
                    {
                        model: db.Ordercode,
                        as: 'ordercode'
                    },
                    {
                        model: db.Payinfo,
                        as: 'payinfo',
                        foreignKey: 'orderId'
                    },
                    {
                        model: db.Product,
                        as: 'product'
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ]
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                res.render('4_orders/cancel_index', objData);
            }) 
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
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            cancelChk: true
                        },
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
                        foreignKey: 'orderId'
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            url: q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'},
                        }
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                        where: {
                            korPhone: q.korPhone? { [Op.like]: `%${q.korPhone}%` } : {[Op.regexp]: '^'}, 
                        }
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
                res.render('4_orders/cancel_index', objData);
            })   
        }
    },
}