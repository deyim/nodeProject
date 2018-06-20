const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 2;


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
    
    orderedIndex: (req,res)=>{
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
                            paidChk: false 
                        }
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                ]
            })
            .then(orders=>{
                if(orders.count ==0){
                    res.render('3_orders/ordered_index',{ordersCount:0});
                }
                ordersToArray(orders)
                .then(obj=>{
                    objData = obj;
                })  
            })
            .then(()=>{
                setTimeout(()=>{
                    res.render('3_orders/ordered_index', objData);
                },1000);                
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
                        where: { paidChk: false },
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
                    }
                ]
            })
            .then(orders=>{
                if(orders.count ==0){
                    res.render('3_orders/ordered_index',{ordersCount:0});
                }
                ordersToArray(orders)
                .then(obj=>{
                    objData = obj;
                })  
            })
            .then(()=>{
                setTimeout(()=>{
                    res.render('3_orders/ordered_index', objData);
                },1000);                
            });   
        }
    },

    paidIndex: (req,res)=>{
        // console.log('************\n\n\n\n\n******',req.query);
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
                        where: {
                            id: res.locals.store.id
                        }
                    },
                ]
            })
            .then(orders=>{
                if(orders.count ==0){
                    res.render('3_orders/paid_index',{ordersCount:0});
                }
                ordersToArray(orders)
                .then(obj=>{
                    objData = obj;
                })  
            })
            .then(()=>{
                setTimeout(()=>{
                    console.log(objData);
                    res.render('3_orders/paid_index', objData);
                },900);                
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
                            placeChk: false,
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
                    }
                ]
            })
            .then(orders=>{
                if(orders.count ==0){
                    res.render('3_orders/paid_index',{ordersCount:0});
                }
                ordersToArray(orders)
                .then(obj=>{
                    objData = obj;
                })  
            })
            .then(()=>{
                setTimeout(()=>{
                    res.render('3_orders/paid_index', objData);
                },1000);                
            }); 
        }
    },

    placedIndex: (req,res)=>{
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
                            cancelChk: false,
                        },
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    }
                ]
            })
            .then(orders=>{
                if(orders.count ==0){
                    res.render('3_orders/placed_index',{ordersCount:0});
                }
                ordersToArray(orders)
                .then(obj=>{
                    objData = obj;
                })  
            })
            .then(()=>{
                setTimeout(()=>{
                    res.render('3_orders/placed_index', objData);
                },1000);                
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
                            placeChk: true,
                            cancelChk: false
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
                            code: { [Op.like]: `%${q.ordercode}%` }
                        }
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            url: { [Op.like]: `%${q.url}%` }
                        }
                    },
                    {
                        model: db.User,
                        as: 'buyer',
                        where: {
                            username: { [Op.like]: `%${q.username}%` }
                        }
                    }
                ]
            })
            .then(orders=>{
                if(orders.count ==0){
                    res.render('3_orders/placed_index',{ordersCount:0});
                }
                ordersToArray(orders)
                .then(obj=>{
                    objData = obj;
                })  
            })
            .then(()=>{
                setTimeout(()=>{
                    res.render('3_orders/placed_index', objData);
                },1000);                
            }); 
        }
    },

    usedIndex: (req,res)=>{
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
                    endDate: {[Op.gte]: limit},
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeChk: true,
                            
                        },
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    },
                ]
            })
            .then(orders=>{
                if(orders.count ==0){
                    res.render('3_orders/used_index',{ordersCount:0});
                }
                ordersToArray(orders)
                .then(obj=>{
                    objData = obj;
                })  
            })
            .then(()=>{
                setTimeout(()=>{
                    res.render('3_orders/used_index', objData);
                },1000);                
            }); 
        }      
        else{
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    endDate: {[Op.lte]: limit},
                },
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
                            placeChk: true,
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
                    }
                ]
            })
            .then(orders=>{
                if(orders.count ==0){
                    res.render('3_orders/used_index',{ordersCount:0});
                }
                ordersToArray(orders)
                .then(obj=>{
                    objData = obj;
                })  
            })
            .then(()=>{
                setTimeout(()=>{
                    res.render('3_orders/used_index', objData);
                },1000);                
            }); 
        }
    },

    finalIndex: (req,res)=>{
        // console.log('************\n\n\n\n\n******',req.query);
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
                        },
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: {
                            id: res.locals.store.id
                        }
                    }
                ]
            })
            .then(orders=>{
                if(orders.count ==0){
                    res.render('3_orders/final_index',{ordersCount:0});
                }
                ordersToArray(orders)
                .then(obj=>{
                    objData = obj;
                })  
            })
            .then(()=>{
                setTimeout(()=>{
                    res.render('3_orders/final_index', objData);
                },1000);                
            }); 
        }      
        else{
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    endDate: {[Op.lte]: limit},
                },
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
                            placeChk: true,
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
                    }
                ]
            })
            .then(orders=>{
                if(orders.count ==0){
                    res.render('3_orders/final_index',{ordersCount:0});
                }
                ordersToArray(orders)
                .then(obj=>{
                    objData = obj;
                })  
            })
            .then(()=>{
                setTimeout(()=>{
                    res.render('3_orders/final_index', objData);
                },1000);                
            }); 
        }
    },

    cancelIndex: (req,res)=>{
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
                        where: {
                            id: res.locals.store.id
                        }
                    }
                ]
            })
            .then(orders=>{
                if(orders.count ==0){
                    res.render('3_orders/cancel_index',{ordersCount:0});
                }
                ordersToArray(orders)
                .then(obj=>{
                    objData = obj;
                })  
            })
            .then(()=>{
                setTimeout(()=>{
                    res.render('3_orders/cancel_index', objData);
                },1000);                
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
                        {cancelChk: true}
                    ]   
                    ///상품명, 주문번호, 주문자아이디, 판매스토어주소
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
                    }
                ]
            })
            .then(orders=>{
                if(orders.count ==0){
                    res.render('3_orders/cancel_index',{ordersCount:0});
                }
                ordersToArray(orders)
                .then(obj=>{
                    objData = obj;
                })  
            })
            .then(()=>{
                setTimeout(()=>{
                    res.render('3_orders/cancel_index', objData);
                },1000);                
            });  
        }
    },


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