const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op

module.exports = {
    categoryIndex: (req,res)=>{
        db.Category.findAll({
            order: [
                ['id']
            ]
        })
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
    categoryAdd: (req,res)=>{
        console.log(req.body);
        db.Category.create(req.body)
        .then(()=>{
            res.redirect('/categories/');
        })
    },
    categoryEdit: (req,res)=>{
        req.category.update({
            name: req.body.name
        })
        .then(()=>{
            res.redirect('/categories/');
        })
    },
    categoryDelete: (req,res)=>{
        req.category.destroy();
        res.redirect('/categories');
    },
}