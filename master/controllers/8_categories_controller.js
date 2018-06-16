const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op

module.exports = {
    categoryIndex: (req,res)=>{
        db.Category.findAll()
        .then(categories=>{
            res.render("8_categories/categories_index", {categories});
        })
    },
    findCategory: (req,res,next)=>{
        db.Category.findById(req.params.id)
        .then(category=>{
            req.category = category;
            next();
        })
    },

    // commuAdd: (req,res)=>{},
    // commuEdit: (req,res)=>{},
    // commuDelete: (req,res)=>{},
    // noticeAdd: (req,res)=>{},
    // noticeEdit: (req,res)=>{},
    // noticeDelete: (req,res)=>{},
    categoryAdd: (req,res)=>{
        console.log(req.body);
        db.Category.create(req.body)
        .then(()=>{
            res.redirect('/categories/');
        })
    },
    categoryEdit: (req,res)=>{
        ss;
    },
    categoryDelete: (req,res)=>{
        req.category.destroy();
        res.redirect('/categories');
    },
}