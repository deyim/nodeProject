const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 5;

module.exports = {

    categoriesIndex: (req,res)=>{
        res.render('categories');
    },
}