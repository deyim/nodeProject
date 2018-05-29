const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op

module.exports = {
    findStore: (req,res,next)=>{
        db.Store.findById(req.params.store_id)
        .then(store=>{
            if(!store){
                req.flash('error', '없는 유저입니다.');
                res.redirect('/members/users');
            }
            req.store = store;
            next();
            
        });
    },
    storesIndex: (req,res)=>{

    },

    storesShow: (req,res)=>{

    },
    storesUpdate: (req,res)=>{
        
    },
    //stores - delete
    storesDelete: (req,res)=>{
        
    }
    
}