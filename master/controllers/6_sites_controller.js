const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op

module.exports = {

    bannersIndex: (req,res)=>{
        db.AdStory.findAll()
        .then(adstories=>{
            req.adstories = adstories;
        });

        db.AdStore.findAll()
        .then(adstores=>{
            req.adstores = adstores;
        });

        db.AdNewstore.findAll()
        .then(adnewstores=>{
            req.adnewstores = adnewstores;
        });

        db.AdAffiliation.findAll()
        .then(adaffiliations=>{
            req.adaffiliations = adaffiliations;
        });

        res.render("");
        
    },

    adstoryAdd: (req, res)=>{

    },

    adstoryCreate: (req, res)=>{

    },

    adstoryDelete: (req, res)=>{

    },

    adstoreAdd: (req, res)=>{

    },

    adstoreCreate: (req, res)=>{

    },

    adstoreDelete: (req, res)=>{

    },

    adnewstoreAdd: (req, res)=>{

    },

    adnewstoreCreate: (req, res)=>{

    },

    adnewstoreDelete: (req, res)=>{

    },

    adaffiliationAdd: (req, res)=>{

    },

    adaffiliationCreate: (req, res)=>{

    },

    adaffiliationDelete: (req, res)=>{

    },
      
    findNotice: (req,res,next)=>{

    },

    noticesIndex: (req,res)=>{

    },

    noticeAdd: (req,res)=>{

    },

    noticeCreate: (req,res)=>{

    },

    noticeShow: (req,res)=>{

    },

    noticeUpdate: (req,res)=>{

    },

    noticeDelete: (req,res)=>{

    },

    faqsIndex: (req,res)=>{

    },

    findFaq: (req,res,next)=>{

    },

    faqAdd: (req,res)=>{

    },

    faqCreate: (req,res)=>{

    },

    faqShow: (req,res)=>{

    },

    faqUpdate: (req,res)=>{

    },

    faqDelete: (req,res)=>{

    },
    


    findMaster: (req,res,next)=>{
        db.Master.findById(req.params.master_id)
        .then(master=>{
            if(!master){
                req.flash('error', '없는 마스터입니다.');
                res.redirect('/masters/');
            }
            req.master = master;
            next();
        });
    },
    mastersIndex: (req,res)=>{
        // db.Master.findAll()
    },

    mastersShow: (req,res)=>{

    },
    mastersUpdate: (req,res)=>{
        
    },
    //stores - delete
    mastersDelete: (req,res)=>{
        
    }
    
}