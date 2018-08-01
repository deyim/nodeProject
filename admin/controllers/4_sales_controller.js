const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 5;
const dateFunctions = require('../../lib/date_functions');

module.exports = {
    allIndex: (req,res)=>{ 
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

       // if(Object.keys(q).length === 0){
        db.Order.findAndCountAll({
            limit: perPage,
            offset: perPage*(page-1),
            include:[
                {
                    model: db.OrderStatus,
                    as: 'orderStatus',
                },
                {
                    model: db.Store,
                    as: 'store',
                    where: { id: res.locals.store.id}
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
            objData.orders = orders.rows;
            objData.ordersCount = orders.count;                                        
            //res.render("4_sales/all_index",objData);
            if(Object.keys(q).length == 0){
                objData.query_orders = objData.orders;
                objData.query_ordersCount = objData.ordersCount;
                objData.query_searchedSales = objData.sales
                res.render("4_sales/all_index",objData);
            }
            else if(Object.keys(q).length != 0){   
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
                            where: { id: res.locals.store.id}
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
                objData.query_searchedSales = 0
                for(var i = 0 ; i < orders.rows.length; i++){
                    sales += orders.rows[i].price;
                }
                // objData = {orders:orders.rows, ordersCount: orders.count, firstday, q}
                
                res.render("4_sales/all_index",objData);
            })
        }
        });         
        
    },

    balanceIndex: (req,res)=>{ 
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;    
        let objData = {firstday, q};

        if(Object.keys(q).length == 0){
            db.Withdrawl.findAndCountAll({
                where: {
                    storeId: res.locals.store.id
                }
            })
            .then(withdrawls=>{
                objData.withdrawls = withdrawls.rows;
                objData.withdrawlsCount = withdrawls.count;
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
                }
            })
            .then(withdrawls=>{
                objData.withdrawls = withdrawls.rows;
                objData.withdrawlsCount = withdrawls.count;
            })
        }

        //withdrawn - 정산완료건
        db.Withdrawl.sum("total",{
            where: {
                storeId: res.locals.store.id,
                withdrawnChk: true
            },
        }).then(withdrawnTotal=>{
            objData.withdrawnTotal = withdrawnTotal ? withdrawnTotal : 0;
        })
        .then(()=>{
            db.Withdrawl.sum("totalCost",{
                where: {
                    storeId: res.locals.store.id,
                    withdrawnChk: true
                }
            }).then(withdrawnTotalCost=>{
                objData.withdrawnTotalCost = withdrawnTotalCost ? withdrawnTotalCost : 0;
            })
        })

        //settled - 정산확정건
        db.Withdrawl.sum("total",{
            where: {
                storeId: res.locals.store.id,
                withdrawnChk: false
            }
        }).then(settledTotal=>{
            objData.settledTotal = settledTotal ? settledTotal : 0;
        })
        .then(()=>{
            db.Withdrawl.sum("totalCost",{
                where: {
                    storeId: res.locals.store.id,
                    withdrawnChk: false
                }
            }).then(settledTotalCost=>{
                objData.settledTotalCost = settledTotalCost ? settledTotalCost : 0;
            })
        })

        //unsettled - 정산미확정건
        db.Withdrawl.sum("total",{
            where: {
                storeId: res.locals.store.id,
                withdrawnChk: null
            }
        }).then(unsettledTotal=>{
            objData.unsettledTotal = unsettledTotal ? unsettledTotal : 0;
        })
        .then(()=>{
            db.Withdrawl.sum("totalCost",{
                where: {
                    storeId: res.locals.store.id,
                    withdrawnChk: null
                }
            }).then(unsettledTotalCost=>{
                objData.unsettledTotalCost = unsettledTotalCost ? unsettledTotalCost : 0;
                res.render("4_sales/balance_index", objData);
            })
        })

        
    },

    withdrawlsIndex: (req,res)=>{ 
        db.Withdrawl.findAndCountAll({
            where: {
                storeId: res.locals.store.id
            }
        }).then(withdrawls_=>{
            objData = {withdrawls:withdrawls_.rows, withdrawlsCount:withdrawls_.count}
            res.render("4_sales/withdrawls_index", objData);
        })
        
    },

    withdrawlShow: (req,res)=>{ 
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
                    where: { id: res.locals.store.id}
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
            res.render("4_sales/withdrawl_orders",{orders});
        })
        
    },
     
}