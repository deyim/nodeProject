const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 3;
const dateFunctions = require('../../lib/date_functions');
var today = new Date();
var yesterday = new Date();

module.exports = {
    salesAllIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;    
        
        //let sales;
        let objData = {firstday, q};
        db.Category.findAll()
        .then(categories=>{
            objData.categories = categories;
        })
        db.Order.sum('price')
        .then(sum => {objData.sales = sum;});
        db.Order.count()
        .then(count =>{ objData.ordersCount = count; });
        db.Order.sum('storeCost')
        .then(sum => { objData.storeCost = sum; });
        db.Order.sum('pgCost')
        .then(sum => { objData.pgCost = sum; });
        db.Order.sum('realPrice')
        .then(sum => { objData.realPrice = sum; });

        if(Object.keys(q).length === 0){
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                },
                include:[
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
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
                objData.query_orders = orders.rows;
                objData.query_ordersCount = orders.count;
                let sales=0;
                for(var i = 0 ; i < orders.rows.length; i++){
                    sales += orders.rows[i].price;
                }
                objData.query_searchedSales = sales;
                // objData = {orders:orders.rows, ordersCount: orders.count, firstday, q}
                res.render('5_sales/all_index', objData);                           
            });   
        }      
        if(Object.keys(q).length != 0){   
            let orderStatusObj = {}
            if(req.query.status == "ordered"){
                orderStatusObj = {
                    paidChk: true,
                    placeDate: null
                }
            }
            else if(req.query.status == "used"){
                orderStatusObj = {
                    paidChk: true,
                    placeChk: true,
                    denyChk: false   
                }
            }
            else if(req.query.status == "final"){
                orderStatusObj = {
                    paidChk: true,
                    placeChk: true,
                    finalChk: true
                }
            }       
            db.Order.findAndCountAll({
                where:{      
                    [Op.and]:
                        [
                            {
                                createdAt: {
                                    [Op.and]:[
                                        {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                        {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                    ]
                                }
                            },
                        ]          
                },
                include:[
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: orderStatusObj
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
                        as: 'product',
                        include: [
                            {
                                model: db.Category,
                                as: 'category',
                                where: {
                                    engName: q.category? { [Op.like]: q.category} : {[Op.regexp]: '^'},
                                    //id: q.id? { [Op.like]: q.id} : {[Op.regexp]: '[0-9]'}, 
                                }
                            },
                        ]
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ],
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(orders=>{       
                objData.query_orders = orders.rows;
                objData.query_ordersCount = orders.count;       
                let sales=0;
                for(var i = 0 ; i < orders.rows.length; i++){
                    sales += orders.rows[i].price;
                }
                objData.query_searchedSales = sales; 
                // objData = {orders:orders.rows, ordersCount: orders.count, firstday, q}
                res.render('5_sales/all_index', objData);   
            })
        }

        
           
    },
    salesEachReady: (req,res)=>{
        res.render('5_sales/each_index');   
    },
    salesEachIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;    
        
        //let sales;
        let objData = {firstday, q};
        db.Category.findAll()
        .then(categories=>{
            objData.categories = categories;
        })

        // db.Order.sum('price',{include: [{model: db.Store, as: 'store', where: {url: req.params.store_url}}]})
        // .then(sum => {objData.sales = sum;});

        // db.Order.count( { where: { url: req.params.store_url}})
        // .then(count =>{ console.log('\\n\n%%',count);objData.count = count; });
        
        // db.Order.sum('storeCost', { where: { url: req.params.store_url}})
        // .then(sum => { objData.storeCost = sum; });
        
        // db.Order.sum('pgCost', { where: { url: req.params.store_url}})
        // .then(sum => { objData.pgCost = sum; });
        
        // db.Order.sum('realPrice', { where: { url: req.params.store_url}})
        // .then(sum => { objData.realPrice = sum; });

        if(Object.keys(q).length === 0){
            db.Order.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                },
                include:[
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            
                        }
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: { url: req.params.store_url}
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
                objData.orders = orders.rows;
                objData.ordersCount = orders.count;
                let sales=0,storeCost=0,pgCost=0,realPrice=0;
                for(var i = 0 ; i < orders.rows.length; i++){
                    sales += orders.rows[i].price;
                    storeCost += orders.rows[i].storeCost;
                    pgCost += orders.rows[i].pgCost;
                    realPrice += orders.rows[i].realPrice;
                }
                objData.sales = sales;
                
                objData.storeCost = storeCost;
                objData.pgCost = pgCost;
                objData.realPrice = realPrice;
                objData.query_orders = orders.rows;
                objData.query_ordersCount = orders.count;  
                objData.query_searchedSale = sales;              
                res.render('5_sales/each_index_store', objData);                           
            });   
        }      
        else{          
            let orderStatusObj = {}
            if(req.query.status == "ordered"){
                orderStatusObj = {
                    paidChk: true,
                    placeDate: null
                }
            }
            else if(req.query.status == "used"){
                orderStatusObj = {
                    paidChk: true,
                    placeChk: true,
                    denyChk: false   
                }
            }
            else if(req.query.status == "final"){
                orderStatusObj = {
                    paidChk: true,
                    placeChk: true,
                    finalChk: true
                }
            }    
            db.Order.findAndCountAll({
                where:{
                    [Op.and]:
                        [
                            {
                                createdAt: {
                                    [Op.and]:[
                                        {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                        {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                    ]
                                }
                            },
                        ]                      
                },
                include:[
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: orderStatusObj
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        where: { url: req.params.store_url}
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
                        as: 'product',
                        include: [
                            {
                                model: db.Category,
                                as: 'category',
                                where: {
                                    engName: q.category? { [Op.like]: q.category} : {[Op.regexp]: '^'},
                                    //id: q.id? { [Op.like]: q.id} : {[Op.regexp]: '[0-9]'}, 
                                }
                            },
                        ]
                    },
                    {
                        model: db.ServiceUser,
                        as: 'serviceUsers',
                    },
                    {
                        model: db.User,
                        as: 'buyer'
                    }
                ],
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(orders=>{       
                objData.query_orders = orders.rows;
                objData.query_ordersCount = orders.count;       
                let sales=0;
                for(var i = 0 ; i < orders.rows.length; i++){
                    sales += orders.rows[i].price;
                }
                objData.query_searchedSales = sales;         
                // objData = {orders:orders.rows, ordersCount: orders.count, firstday, q}
                res.render('5_sales/each_index_store', objData);   
            })
        }

        
           
    },
    salesDistribute: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;    
        let objData = {firstday, q};


        if(Object.keys(q).length == 0){
            db.Withdrawl.findAndCountAll({
            })
            .then(withdrawls=>{
                objData.withdrawls = withdrawls.rows;
                objData.withdrawlsCount = withdrawls.count;
                // res.render('5_sales/distribute_index', objData);  
            })
        }
        else{
            db.Withdrawl.findAndCountAll({
                where: {
                    storeId: res.locals.store.id,
                    [Op.and]:
                        [
                            {
                                createdAt: {
                                    [Op.and]:[
                                        {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                        {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                    ]
                                }
                            },
                        ] 
                },
             })
            .then(withdrawls=>{
                objData.withdrawls = withdrawls.rows;
                objData.withdrawlsCount = withdrawls.count;
            })
        }

        //withdrawn - 정산완료건
        db.Withdrawl.sum("total",{
            where: {
                withdrawnChk: true
            },
        }).then(withdrawnTotal=>{
            objData.withdrawnTotal = withdrawnTotal ? withdrawnTotal : 0;
        })
        .then(()=>{
            db.Withdrawl.sum("totalCost",{
                where: {
                    withdrawnChk: true
                }
            }).then(withdrawnTotalCost=>{
                objData.withdrawnTotalCost = withdrawnTotalCost ? withdrawnTotalCost : 0;
            })
        })

         //settled - 정산확정건
         db.Withdrawl.sum("total",{
            where: {
                withdrawnChk: false
            }
        }).then(settledTotal=>{
            objData.settledTotal = settledTotal ? settledTotal : 0;
        })
        .then(()=>{
            db.Withdrawl.sum("totalCost",{
                where: {
                    withdrawnChk: false
                }
            }).then(settledTotalCost=>{
                objData.settledTotalCost = settledTotalCost ? settledTotalCost : 0;
            })
        })


        //unsettled - 정산미확정건
        db.Withdrawl.sum("total",{
            where: {
                withdrawnChk: null
            }
        }).then(unsettledTotal=>{
            objData.unsettledTotal = unsettledTotal ? unsettledTotal : 0;
        })
        .then(()=>{
            db.Withdrawl.sum("totalCost",{
                where: {
                    withdrawnChk: null
                }
            }).then(unsettledTotalCost=>{
                objData.unsettledTotalCost = unsettledTotalCost ? unsettledTotalCost : 0;
                res.render('5_sales/distribute_index', objData); 
            })
        })


        // res.render('5_sales/distribute_index', objData);   
    },

    salesWithdrawlShow: (req,res)=>{ 
        db.Order.findAll({
            include: [
                {
                    model: db.Withdrawl,
                    as: 'withdrawl',
                    where: {
                        id: req.params.withdraw_id
                    }
                },
                {
                    model: db.OrderStatus,
                    as: 'orderStatus',
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
        }).then(orders=>{
            res.render("5_sales/withdrawl_orders",{orders});
        })
        
    },
    salesDistributedOrders:(req,res)=>{
        ;
    },
    salesWithdrawl: (req,res)=>{
        db.Withdrawl.findAndCountAll({
            include: [
                {
                    model: db.Store,
                    as:'store'
                },
                {
                    model: db.Provider,
                    as:'provider'
                }
            ]
        }).then(withdrawls_=>{
            objData = {withdrawls:withdrawls_.rows, withdrawlsCount:withdrawls_.count}
            res.render("5_sales/withdrawls_index", objData);
        })
    }
}