const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 5;
const dateFunctions = require('../../lib/date_functions');

let noQueryInclude = [
    {
        model: db.Option,
        as: 'option'
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
];

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
            cancelChk: true,
            cancelReqChk: false
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
            cancelChk: false,
            cancelReqChk: false
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
    
    //show service users of each order
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
        noQueryInclude.push({
            model: db.OrderStatus,
            as: 'orderStatus',
            where: { 
                paidChk: false, 
                denyChk: false
            }
        });
        
        if(Object.keys(req.query).length === 0){            
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: noQueryInclude                
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                noQueryInclude.pop();
                res.render('4_orders/ordered_index', objData);
            })   
        }      
        else{
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
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
                noQueryInclude.pop();
                res.render('4_orders/ordered_index', objData);
            })
        }
    },

    orderedStatusChange: (req,res)=> {
        let orders = req.body.checked? req.body.checked.toString().split(',') : [];    
        if(req.body.paidChk){          
            paidChkChange(orders);
        }else if(req.body.denyChk){
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
        noQueryInclude.push({
            model: db.OrderStatus,
            as: 'orderStatus',
            where: { 
                paidChk: true,
                placeDate: null
            }
        });
        if(Object.keys(req.query).length === 0){
            
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: noQueryInclude
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                noQueryInclude.pop();
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
                            placeDate: null,
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
                where: {
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
                noQueryInclude.pop();
                res.render('4_orders/paid_index', objData);
            }) 
        }
    },

    paidStatusChange: (req,res)=>{
        let orders = req.body.checked? req.body.checked.toString().split(',') : [];    
        
        denyChkChange(orders);
        res.redirect('/orders/ordered');     
    },

    placedIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        let objData = {};
        noQueryInclude.push({
            model: db.OrderStatus,
            as: 'orderStatus',
            where: { 
                paidChk: true,
                placeDate: {
                    [Op.ne]: null
                }
            }
        });
        if(Object.keys(req.query).length === 0){            
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: noQueryInclude
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                noQueryInclude.pop();
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
                            placeDate: {
                                [Op.ne]: null
                            }
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
                where: {
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
                noQueryInclude.pop();
                res.render('4_orders/placed_index', objData);
            })  
        }
    },

    placedStatusChange: (req,res)=>{

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
        noQueryInclude.push({
            model: db.OrderStatus,
            as: 'orderStatus',
            where: { 
                paidChk: true, 
                placeChk: true,
                denyChk: false
            }
        });
        
        if(Object.keys(req.query).length === 0){
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    startDate: {[Op.lte]: today},
                    endDate: {[Op.gte]: limit},
                },
                include: noQueryInclude
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                noQueryInclude.pop();
                res.render('4_orders/used_index', objData);
            }) 
        }      
        else{
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [{
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
                where: {
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
                noQueryInclude.pop();
                res.render('4_orders/used_index', objData);
            }) 
        }
    
    },

    usedStatusChange: (req,res)=>{

    },


    finalIndex: (req,res)=>{
        //************
        //server computer change final status of DB when three days are past from enddate
        //*************
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        let objData = {};
        var limit = new Date();
        noQueryInclude.push({
            model: db.OrderStatus,
            as: 'orderStatus',
            where: { 
                paidChk: true,
                placeChk: true,
                finalChk: true
            }
        });
        limit.setDate(limit.getDate()+3);
        if(Object.keys(req.query).length === 0){            
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    endDate: {[Op.lt]: limit},
                },
                include: noQueryInclude
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                noQueryInclude.pop();
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
                }
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                noQueryInclude.pop();
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
        noQueryInclude.push({
            model: db.OrderStatus,
            as: 'orderStatus',
            where: { 
                cancelReqChk: true 
            }},
            {
                model: db.CancelRequest,
                as: 'cancelRequest',
                required: true
            }
        );
        if(Object.keys(req.query).length === 0){
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: noQueryInclude 
            })
            .then(orders=>{
                objData = {orders:orders.rows, ordersCount:orders.count, firstday, q};
                noQueryInclude.pop();noQueryInclude.pop();
                res.render('4_orders/cancel_index', objData);
            }) 
        }      
        else{
            db.Order.findAll({
                where: {
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
                noQueryInclude.pop();
                noQueryInclude.pop();
                res.render('4_orders/cancel_index', objData);
            })   
        }
    },
 
    cancelStatusChange: (req,res)=>{
        let orders = req.body.checked? req.body.checked.toString().split(',') : [];    
        if(req.body.cancelAllow){          
            cancelAllow(orders);
        }else if(req.body.cancelDeny){
            cancelDeny(orders);
        }
        res.redirect('/orders/cancel');  
    }
}