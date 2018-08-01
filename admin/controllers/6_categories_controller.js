const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 5;

module.exports = {

    categoriesIndex: (req,res)=>{
        // db.Board.findAll({
        //     where: {
        //         storeId: res.locals.store.id
        //     }
        // })
        // .then(boards=>{
        //     res.render('categories', {boards});
        // })
        
        res.render('categories', {});
    },
}