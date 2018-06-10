const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op

module.exports = {

    orderedIndex: (req,res)=>{
        if(Object.keys(req.query).length === 0){
            
            db.Order.findAll({
                include: [{
                    model: db.OrderStatus,
                    as: 'orderStatus',
                    where: { paidChk: false },
                }]
            })
            .then(orders=>{
                res.render('4_orders/ordered_index', {orders});
            });   
        }      
        else{
            let q = req.query;
            db.Order.findAll({
                include: [{
                    model: db.OrderStatus,
                    as: 'orderStatus',
                    where: { paidChk: false },
                }],
                where:{
                    [Op.or]:
                    [
                        {createdAt: {
                                [Op.gte]: q.startdate ? q.startdate : null,
                                [Op.lte]: q.enddate ? q.enddate : null,
                            }
                        },                        
                        { onSaleChk: q.onSaleChk },
                        { onDisplayChk: q.onDisplayChk },
                    ]   
                    ///상품명, 주문번호, 주문자아이디, 판매스토어주소
                }
            })
            .then(orders=>{
                res.render('¢_orders/ordered_index', {orders});
            })
        }
    },

    orderedShow: (req,res)=>{        
        res.render('4_orders/ordered_show', {order:req.order, today:Date.now()});
    },

    paidIndex: (req,res)=>{
        if(Object.keys(req.query).length === 0){
            
            db.Order.findAll({
                include: [{
                    model: db.OrderStatus,
                    as: 'orderStatus',
                    where: { paidChk: true },
                }]
            })
            .then(orders=>{
                res.render('4_orders/paid_index', {orders});
            });   
        }      
        else{
            let q = req.query;
            db.Order.findAll({
                where:{
                    [Op.or]:
                    [
                        {createdAt: {
                                [Op.gte]: q.startdate ? q.startdate : null,
                                [Op.lte]: q.enddate ? q.enddate : null,
                            }
                        },
                        { onSaleChk: q.onSaleChk },
                        { onDisplayChk: q.onDisplayChk },
                    ]   
                    //상품코드, category (association included)                
                }
            })
            .then(products=>{
                res.render('4_orders/paid_index', {products});
            })
        }
    },

    paidShow: (req,res)=>{
        res.render('4_orders/paid_show', {order:req.order, today:Date.now()});
    },

    placedIndex: (req,res)=>{
        if(Object.keys(req.query).length === 0){
            
            db.Order.findAll({
                include: [{
                    model: db.OrderStatus,
                    as: 'orderStatus',
                    where: { placeChk: true },
                }]
            })
            .then(orders=>{
                res.render('4_orders/placed_index', {orders});
            });   
        }       
        else{
            let q = req.query;
            db.Order.findAll({
                where:{
                    [Op.or]:
                    [
                        {createdAt: {
                                [Op.gte]: q.startdate ? q.startdate : null,
                                [Op.lte]: q.enddate ? q.enddate : null,
                            }
                        },
                        { onSaleChk: q.onSaleChk },
                        { onDisplayChk: q.onDisplayChk },
                    ]   
                    //상품코드, category (association included)                
                }
            })
            .then(products=>{
                res.render('4_orders/placed_index', {products});
            })
        }
    },

    placedShow: (req,res)=>{
        res.render('4_orders/used_show', {order:req.order, today:Date.now()});
    },

    usedIndex: (req,res)=>{
        if(Object.keys(req.query).length === 0){
            db.Order.findAll({
                include: [or]
            })
            .then(products=>{
                res.render('4_orders/used_index', {products});
            });   
        }      
        else{
            let q = req.query;
            db.Order.findAll({
                where:{
                    [Op.or]:
                    [
                        {createdAt: {
                                [Op.gte]: q.startdate ? q.startdate : null,
                                [Op.lte]: q.enddate ? q.enddate : null,
                            }
                        },
                        { onSaleChk: q.onSaleChk },
                        { onDisplayChk: q.onDisplayChk },
                    ]   
                    //상품코드, category (association included)                
                }
            })
            .then(products=>{
                res.render('4_orders/used_index', {products});
            })
        }
    },

    usedShow: (req,res)=>{
        res.render('4_orders/used_show', {order:req.order, today:Date.now()});
    },

    finalIndex: (req,res)=>{
        if(Object.keys(req.query).length === 0){
            db.Order.findAll({
                include: [or]
            })
            .then(products=>{
                res.render('4_orders/final_index', {products});
            });   
        }      
        else{
            let q = req.query;
            db.Order.findAll({
                where:{
                    [Op.or]:
                    [
                        {createdAt: {
                                [Op.gte]: q.startdate ? q.startdate : null,
                                [Op.lte]: q.enddate ? q.enddate : null,
                            }
                        },
                        { onSaleChk: q.onSaleChk },
                        { onDisplayChk: q.onDisplayChk },
                    ]   
                    //상품코드, category (association included)                
                }
            })
            .then(products=>{
                res.render('4_orders/final_index', {products});
            })
        }
    },

    finalShow: (req,res)=>{
        res.render('4_orders/final_show', {order:req.order, today:Date.now()});
    },

    cancelIndex: (req,res)=>{
        if(Object.keys(req.query).length === 0){
            db.Order.findAll({
                include: [or]
            })
            .then(products=>{
                res.render('4_orders/cancel_index', {products});
            });   
        }      
        else{
            let q = req.query;
            db.Order.findAll({
                where:{
                    [Op.or]:
                    [
                        {createdAt: {
                                [Op.gte]: q.startdate ? q.startdate : null,
                                [Op.lte]: q.enddate ? q.enddate : null,
                            }
                        },
                        { onSaleChk: q.onSaleChk },
                        { onDisplayChk: q.onDisplayChk },
                    ]   
                    //상품코드, category (association included)                
                }
            })
            .then(products=>{
                res.render('4_orders/cancel_index', {products});
            })
        }
    },

    cancelShow: (req,res)=>{
        res.render('4_orders/cancel_show', {order:req.order, today:Date.now()});
    },
  

}