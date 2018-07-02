const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 10;
const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

module.exports = {
    productcodesIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        let categories;
        db.Category.findAll()
        .then(categories_=>{categories=categories_;});
        if(Object.keys(req.query).length === 0){
            objData = {};
            db.Productcode.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.Category,
                        as: 'category'
                    }                    
                ]
            })
            .then(codes=>{                        
                res.render("7_codes/productcodes_index",{codes:codes.rows, codesCount:codes.count, categories});  
            });  
        }
        else{
            db.Productcode.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.Category,
                        as: 'category',
                        where: {
                            id: q.category? q.category : {[Op.regexp]: '^'},
                        }
                    } 
                ],
                where: {
                    code: q.productcode? q.productcode : {[Op.regexp]: '^'},
                }
            })
            .then(codes=>{                        
                res.render("7_codes/productcodes_index",{codes:codes.rows, codesCount:codes.count, categories});  
            });  
        }
              
    },

    productcodesAdd: (req,res)=>{
        db.Category.findAll()
        .then(categories=>{
            req.categories = categories;
        })
        .then(()=>{
            res.render("7_codes/productcodes_add", {categories:req.categories});
        })
    },

    productcodesGenerate: (req,res)=>{
        console.log(req.body.category);
        let amount = req.body.amount;
        let codes = [];
        let tmp = ""
        
        db.Category.find({
            where: {
                id: req.body.category
            }
        })
        .then(category=>{
            for(var i = 0 ; i < amount ; i++){
                tmp = category.engName;
                for(var j = 0 ; j < 6 ; j++)
                    tmp += possible.charAt(Math.floor(Math.random() * possible.length));
                codes.push({categoryId: category.id, code: tmp, createdAt: Date.now()});
            }
            db.Productcode.bulkCreate(codes)
            .then((codes)=>{                
                console.log(codes);
                res.redirect("/codes/products")
            })
        });        

        
        
        
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
        res.render("7_codes/ordercodes_add");
    },

    ordercodesGenerate: (req,res)=>{
        let amount = req.body.amount;
        let codes = [];
        let tmp = "";

        for(var i = 0 ; i < amount ; i++){
            tmp = "";
            for(var j = 0 ; j < 7 ; j++)
                tmp += possible.charAt(Math.floor(Math.random() * possible.length));
            codes.push({code: tmp, usedChk: false, createdAt: Date.now()});
        }
        console.log(codes);
        db.Ordercode.bulkCreate(codes)
        .then(()=>{            
            res.redirect("/codes/orders");
        })
        .catch(db.Sequelize.ValidationError, function (err) {
            console.log(err);
        });

    },

    noticecodesIndex: (req,res)=>{
        db.Noticecode.findAndCountAll()
        .then(codes=>{                        
            res.render("7_codes/noticecodes_index",{codes:codes.rows, codesCount:codes.count});  
        });  
    },
    
    noticecodesDelete: (req,res)=>{
        db.Noticecode.findById(req.params.id)
        .then(code=>{
            code.destroy();
            res.redirect("/codes/notices/")
        })
    },

    noticecodesGenerate: (req,res)=>{
       db.Noticecode.create({
           code: req.body.code
       })
       .then(()=>{
           res.redirect("/codes/notices/");
       })
    },

    faqcodesIndex: (req,res)=>{
        db.FAQcode.findAndCountAll()
        .then(codes=>{                        
            res.render("7_codes/faqcodes_index",{codes:codes.rows, codesCount:codes.count});  
        });  
    },

    faqcodesDelete: (req,res)=>{
        db.FAQcode.findById(req.params.id)
        .then(code=>{
            code.destroy();
            res.redirect("/codes/faqs/")
        })
    },

    faqcodesGenerate: (req,res)=>{
        db.FAQcode.create({
            code: req.body.code
        })
        .then(()=>{
            res.redirect("/codes/faqs/");
        })
    }
}
