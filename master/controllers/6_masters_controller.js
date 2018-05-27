const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op

module.exports = {
    findMaster: (req,res,next)=>{
        db.Master.findById(req.params.master_id)
        .then(master=>{
            if(!master){
                req.flash('error', '없는 유저입니다.');
                res.redirect('/managers/');
            }
            req.master = master;
            next();
        });
    },
    mastersIndex: (req,res)=>{

    },

    mastersShow: (req,res)=>{

    },
    mastersUpdate: (req,res)=>{
        
    },
    //stores - delete
    mastersDelete: (req,res)=>{
        
    }
    
}