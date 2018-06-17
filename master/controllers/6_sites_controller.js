const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 5;

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


        res.render('6_sites/banners_index');
        
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
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        if(Object.keys(req.query).length === 0){
            db.Notice.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(notices=>{
                // console.log('\n\n\n****',notices);
                db.Noticecode.findAll()
                .then(codes=>{                    
                    objData = {notices:notices.rows, noticesCount: notices.count, noticecodes:codes};
                    res.render('6_sites/notices_index', objData);
                });                
            });
        }
        else{
            let type;            
            if(q.type === "사용자"){
                console.log('\n\n\**',q.type);
                type = "A"
            }else{
                type = "B"
            }
            db.Notice.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.Noticecode,
                        as: 'noticecode',
                        foreignKey: 'noticecodeId',
                        where: {
                            code: { [Op.like]: `%${q.code}%` }
                        }
                    }
                ],
                where: {
                    type: type
                }
            })
            .then(notices=>{
                
                db.Noticecode.findAll({
                })
                .then(codes=>{
                    objData = {notices:notices.rows, noticesCount: notices.count, noticecodes:codes};
                    res.render('6_sites/notices_index', objData);
                });   
            });
        }
        
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

    /***********************
          sites/faqs
    ***********************/

    faqsIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        if(Object.keys(req.query).length === 0){
            db.Faq.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1)
            })
            .then(faqs=>{
                db.FAQcode.findAll({
                })
                .then(codes=>{
                    
                    objData = {faqs:faqs.rows, faqsCount: faqs.count, faqcodes:codes};
                    res.render('6_sites/faqs_index', objData);
                });                
            });
        }
        else{
            let type;
            if(q.type === "사용자"){
                type = "A"
            }else{
                type = "B"
            }
            db.Faq.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.FAQcode,
                        as: 'faqcode',
                        foreignKey: 'faqcodeId',
                        where: {
                            code: { [Op.like]: `%${q.code}%` }
                        }
                    }
                ],
                where: {
                    type: type
                }
            })
            .then(faqs=>{
                console.log('\n\n***', faqs, q.code);
                db.FAQcode.findAll({
                })
                .then(codes=>{
                    objData = {faqs:faqs.rows, faqsCount: faqs.count, faqcodes:codes};
                    res.render('6_sites/faqs_index', objData);
                });   
            });
        }
        
    },

    findFaq: (req,res,next)=>{
        db.Faq.findById(req.params.faq_id)
        .then(faq=>{
            req.faq = faq;
            faq.getFaqcode()
            .then(code=>{
                req.code = code;
                next();
            })
        })
    },

    faqAdd: (req,res)=>{

    },

    faqCreate: (req,res)=>{

    },

    faqShow: (req,res)=>{
        objData = {faq:req.faq, code:req.code};
        res.render("6_sites/faqs_show",objData);
    },

    faqUpdate: (req,res)=>{

    },

    faqDelete: (req,res)=>{

    },
    
    /***********************
          sites/masters
    ***********************/


    findMaster: (req,res,next)=>{
        db.Master.findById(req.params.master_id)
        .then(master=>{
            if(!master){
                req.flash('error', '없는 마스터입니다.');
                res.redirect('/masters/');
            }
            req.master = master;
            master.getUser()
            .then((user)=>{
                req.masterUser = user;
                next();
            })
            
        });
    },
    mastersIndex: (req,res)=>{
        db.Master.findAll()
        .then(masters=>{
            res.render("6_sites/master_index", {masters});
        });
    },

    mastersAdd: (req,res)=>{
        res.render("6_sites/master_add");
    },

    mastersCreate: (req,res)=>{
        db.User.find({
            where: {
                username: req.body.username
            }
        })
        .then((user)=>{
            console.log('\n\n\n****',user);
            db.Master.create({
                name: req.body.name,
                authority: req.body.authority,
                userId: user.id
            })
            .then((master)=>{
                console.log('\n\n\n****',master);
                res.redirect("/sites/masters");
            })
            .catch(db.Sequelize.ValidationError, function (err) {
                console.log(err);
            });
        })
       
    },

    mastersShow: (req,res)=>{
        objData = {master: req.master, masterUser: req.masterUser};
        res.render("6_sites/master_show", objData);
    },
    mastersUpdate: (req,res)=>{
        req.master.update(req.body)
        .then((()=>{
            req.session.alert = '수정되었습니다.'
            res.redirect('/sites/masters');
        }));
    },
    //stores - delete
    mastersDelete: (req,res)=>{
        req.master.destroy();
        res.redirect('/sites/masters');
    }
    
}