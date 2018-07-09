const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 3;
const dateFunctions = require('../../lib/date_functions');

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
        .then(count =>{ objData.count = count; });
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
                        where: { 
                            
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
                objData.orders = orders.rows;
                objData.ordersCount = orders.count;
                let sales=0;
                for(var i = 0 ; i < orders.rows.length; i++){
                    sales += orders.rows[i].price;
                }
                objData.searchedSales = sales;
                console.log('\n\n\n***',sales);
                // objData = {orders:orders.rows, ordersCount: orders.count, firstday, q}
                res.render('5_sales/all_index', objData);                           
            });   
        }      
        if(Object.keys(q).length != 0){          
            db.Order.findAndCountAll({
                where:{
                    [Op.and]:
                    [
                        {username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'}},
                        {name: q.name? { [Op.like]: `%${q.name}%` } : {[Op.regexp]: '^'}},
                    ]                    
                },
                include:[
                    {
                        model: db.Category,
                        where: {
                            id: q.id? { [Op.like]: q.id} : {[Op.regexp]: '^'}, 
                        }
                    }
                ],
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(orders=>{       
                objData.orders = orders.rows;
                objData.ordersCount = orders.count;         
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
                objData.searchedSales = sales;
                objData.storeCost = storeCost;
                objData.pgCost = pgCost;
                objData.realPrice = realPrice;
                objData.orders = orders.rows;
                objData.ordersCount = orders.count;                
                res.render('5_sales/each_index_store', objData);                           
            });   
        }      
        else{          
            db.Order.findAndCountAll({
                where:{
                    [Op.and]:
                    [
                        {username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'}},
                        {name: q.name? { [Op.like]: `%${q.name}%` } : {[Op.regexp]: '^'}},
                    ]                    
                },
                include:[
                    {
                        model: db.Category,
                        where: {
                            id: q.id? { [Op.like]: q.id} : {[Op.regexp]: '^'}, 
                        }
                    }
                ],
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(orders=>{       
                objData.orders = orders.rows;
                objData.ordersCount = orders.count;         
                // objData = {orders:orders.rows, ordersCount: orders.count, firstday, q}
                res.render('5_sales/each_index_store', objData);   
            })
        }

        
           
    },
    salesDistribute: (req,res)=>{
        res.render('5_sales/distribute_index');   
    },
    salesWithdrawl: (req,res)=>{
        res.render('5_sales/withdrawl_index');   
    }
}