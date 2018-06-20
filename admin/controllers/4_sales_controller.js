const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 5;

module.exports = {
    allIndex: (req,res)=>{ 
        db.Order.findById(2)
        .then(orders=>{
            res.render("4_sales/all_index",{orders});
        })
        
    },

    balanceIndex: (req,res)=>{ 
        res.render("4_sales/balance_index");
    },

    withdrawIndex: (req,res)=>{ 
        res.render("4_sales/withdraw_index");
    },
     
}