const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 10;

module.exports = {
    productcodesIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        if(Object.keys(req.query).length === 0){
            db.Productcode.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(codes=>{                        
                res.render("7_codes/productcodes_index",{codes:codes.rows, codesCount:codes.count});  
            });  
        }
        else{
            db.Productcode.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    code: q.productcode
                }
            })
            .then(codes=>{                        
                res.render("7_codes/productcodes_index",{codes:codes.rows, codesCount:codes.count});  
            });  
        }
              
    },

    productcodesAdd: (req,res)=>{

    },

    productcodesGenerate: (req,res)=>{
        
    },

    ordercodesIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        if(Object.keys(req.query).length === 0){
            db.Ordercode.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(codes=>{                        
                res.render("7_codes/ordercodes_index",{codes:codes.rows, codesCount:codes.count});  
            });  
        }
        else{
            db.Ordercode.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where: {
                    code: q.ordercode
                }
            })
            .then(codes=>{                        
                res.render("7_codes/ordercodes_index",{codes:codes.rows, codesCount:codes.count});  
            });  
        }
           
    },

    ordercodesAdd: (req,res)=>{
        
    },

    ordercodesGenerate: (req,res)=>{
        // var numbers = req.quer.number;
        // db.Ordercode.createbulk()
    },

    noticecodesIndex: (req,res)=>{
        db.Noticecode.findAndCountAll()
        .then(codes=>{                        
            res.render("7_codes/noticecodes_index",{codes:codes.rows, codesCount:codes.count});  
        });  
    },

    noticecodesAdd: (req,res)=>{
        
    },

    noticecodesGenerate: (req,res)=>{
    //    db.Noticecode.create({})
    //    .then(noticecode=>{
           
    //    })
    },

    faqcodesIndex: (req,res)=>{
        db.FAQcode.findAndCountAll()
        .then(codes=>{                        
            res.render("7_codes/faqcodes_index",{codes:codes.rows, codesCount:codes.count});  
        });  
    },

    faqcodesAdd: (req,res)=>{
        
    },

    faqcodesGenerate: (req,res)=>{
    //    db.Noticecode.create({})
    //    .then(noticecode=>{
           
    //    })
    }
}