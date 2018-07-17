const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 5;

module.exports = {
    bannersIndex: (req,res)=>{
        objData = {}
        db.AdStory.findAll()
        .then(adstories=>{
            objData.adstories = adstories;
        })
        .then(()=>{
            db.AdStore.findAll()
            .then(adstores=>{
                objData.adstores = adstores;
            });
        })
        .then(()=>{
            db.AdNewstore.findAll()
            .then(adnewstores=>{
                objData.adnewstores = adnewstores;
            });
        })
        .then(()=>{
            db.AdAffiliation.findAll()
            .then(adaffiliations=>{                
                objData.adaffiliations = adaffiliations;
            })
            .then(()=>{
                res.render("6_sites/banners_index", objData);
            })
        })
        
    },

    adstoryAdd: (req, res)=>{
    },

    adstoryCreate: (req, res)=>{
        db.AdStory.create(req.body)
        .then(()=>{
            res.redirect("/sites/banners");
        })
    },

    adstoryDelete: (req, res)=>{
        db.AdStory.findOne({
            where: {
                id: req.params.adstory_id
            }
        }).then(adstory=>{
            adstory.destroy();
        }).then(()=>{
            res.redirect("/sites/banners");
        })
    },

    adstoreAdd: (req, res)=>{

    },

    adstoreCreate: (req, res)=>{
        db.AdStore.create(req.body)
        .then(()=>{
            res.redirect("/sites/banners");
        })
    },

    adstoreDelete: (req, res)=>{
        db.AdStore.findOne({
            where: {
                id: req.params.adstore_id
            }
        }).then(adstore=>{
            adstore.destroy();
        }).then(()=>{
            res.redirect("/sites/banners");
        })
    },

    adnewstoreAdd: (req, res)=>{

    },

    adnewstoreCreate: (req, res)=>{
        db.AdNewstore.create(req.body)
        .then(()=>{
            res.redirect("/sites/banners");
        })
    },

    adnewstoreDelete: (req, res)=>{
        db.AdNewstore.findOne({
            where: {
                id: req.params.adnewstore_id
            }
        }).then(store=>{
            store.destroy();
        }).then(()=>{
            res.redirect("/sites/banners");
        })
    },

    adaffiliationAdd: (req, res)=>{

    },

    adaffiliationCreate: (req, res)=>{
        db.AdAffiliation.create(req.body)
        .then(()=>{
            res.redirect("/sites/banners");
        })
    },

    adaffiliationDelete: (req, res)=>{
        db.AdAffiliation.findOne({
            where: {
                id: req.params.adaffiliation_id
            }
        }).then(adstory=>{
            adstory.destroy();
        }).then(()=>{
            res.redirect("/sites/banners");
        })
    },
      
    findNotice: (req,res,next)=>{

        db.Noticecode.findAll()
        .then(codes=>{
            req.noticecodes = codes;
        });

        db.Notice.findOne({
            where: {
                id: req.params.notice_id
            },
            include: [
                {
                    model: db.Noticecode,
                    as: 'noticecode'
                }
            ]
        })
        .then(notice=>{
            req.notice = notice;
            next();
        })
    },

    noticesIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page; 
        let noticecodes;

        db.Noticecode.findAll()
        .then(codes=>{noticecodes=codes;});

        if(Object.keys(req.query).length === 0){
            db.Notice.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.Noticecode,
                        as: 'noticecode',
                    }
                ]
            })
            .then(notices=>{                 
                objData = {notices:notices.rows, noticesCount: notices.count, noticecodes, q};
                res.render('6_sites/notices_index', objData);     
            });
        }
        else{
            db.Notice.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.Noticecode,
                        as: 'noticecode',
                        foreignKey: 'noticecodeId',
                        where: {
                            code: q.code ? q.code : {[Op.regexp]: '^'}
                        }
                    }
                ],
                where: {
                    type: q.type? q.type: {[Op.regexp]: '^'},
                    title: q.title? { [Op.like]: `%${q.title}%` } : {[Op.regexp]: '^'},
                }
            })
            .then(notices=>{
                objData = {notices:notices.rows, noticesCount: notices.count, noticecodes, q};
                res.render('6_sites/notices_index', objData); 
            });
        }
        
    },

    noticeAdd: (req,res)=>{
        db.Noticecode.findAll()
        .then(codes=>{                    
            objData = {codes:codes};
            res.render('6_sites/notices_add', objData);
        });    
    },

    noticeCreate: (req,res)=>{
        console.log(req.body)
        let notice = req.body;
        notice.createdAt = Date.now();
        notice.updatedAt = Date.now();

        db.Notice.create(notice)
        .then((anotice)=>{
            console.log(anotice);
            res.redirect("/sites/notices/");
        })
    },

    noticeShow: (req,res)=>{
        notice = req.notice;
        codes = req.noticecodes;
        res.render("6_sites/notices_show", {notice:notice,codes:codes});
    },

    noticeUpdate: (req,res)=>{
        req.notice.update(req.body)
        .then(()=>{
            res.redirect("/sites/notices");
            })
        // })
        
    },

    noticeDelete: (req,res)=>{
        req.notice.destroy();
        res.redirect("/sites/notices");
    },

    noticeMultipleDelete: (req,res)=>{
        let notices = req.body.checked.toString().split(',');
        for(var i = 0 ; i < notices.length; i++){
            db.Notice.findById(notices[i])
            .then(notice=>{
                notice.destroy();
            });
        };
        res.redirect('/sites/notices');
    },

    /***********************
          sites/faqs
    ***********************/

    faqsIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        let faqcodes;

        db.FAQcode.findAll()
        .then(codes=>{faqcodes=codes;});

        if(Object.keys(req.query).length === 0){
            db.Faq.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.FAQcode,
                        as: 'faqcode',
                        foreignKey: 'faqcodeId',
                    }
                ],
            })
            .then(faqs=>{
                console.log(faqs);
                objData = {faqs:faqs.rows, faqsCount: faqs.count, faqcodes, q};
                res.render('6_sites/faqs_index', objData);   
            });
        }
        else{
            db.Faq.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.FAQcode,
                        as: 'faqcode',
                        foreignKey: 'faqcodeId',
                        where: {
                            code: q.code ? q.code : {[Op.regexp]: '^'}
                        }
                    }
                ],
                where: {
                    type: q.type? q.type: {[Op.regexp]: '^'},
                    title: q.title? { [Op.like]: `%${q.title}%` } : {[Op.regexp]: '^'},
                }
            })
            .then(faqs=>{
                objData = {faqs:faqs.rows, faqsCount: faqs.count, faqcodes, q};
                res.render('6_sites/faqs_index', objData);   
            });
        }
        
    },

    findFaq: (req,res,next)=>{
        db.FAQcode.findAll()
        .then(codes=>{
            req.faqcodes = codes;
        });

        db.Faq.findOne({
            where: {
                id: req.params.faq_id
            },
            include: [
                {
                    model: db.FAQcode,
                    as: 'faqcode'
                }
            ]
        })
        .then(faq=>{
            req.faq = faq;
            next();
        })
    },

    faqAdd: (req,res)=>{
        db.FAQcode.findAll()
        .then(codes=>{                    
            objData = {codes:codes};
            res.render('6_sites/faqs_add', objData);
        });  
    },

    faqCreate: (req,res)=>{
        let faq = req.body;
        faq.createdAt = Date.now();
        faq.updatedAt = Date.now();

        db.Faq.create(faq)
        .then((afaq)=>{
            res.redirect("/sites/faqs");
        })
    },

    faqShow: (req,res)=>{
        objData = {faq:req.faq, faqcodes:req.faqcodes};
        res.render("6_sites/faqs_show",objData);
    },

    faqUpdate: (req,res)=>{
        req.faq.update(req.body)
        .then(()=>{
            res.redirect("/sites/faqs");
            })
    },

    faqDelete: (req,res)=>{
        req.faq.destroy();
        res.redirect("/sites/faqs");
    },

    faqsMultipleDelete: (req,res)=>{
        let faqs = req.body.checked.toString().split(',');
        for(var i = 0 ; i < faqs.length; i++){
            db.Faq.findById(faqs[i])
            .then(faq=>{
                faq.destroy();
            });
        };
        res.redirect('/sites/faqs');
    },
    /***********************
          sites/masters
    ***********************/


    findMaster: (req,res,next)=>{
        db.Master.findOne({
            where: {
                id: req.params.master_id
            },
            include: [
                {
                    model: db.User,
                    as: 'user'
                }
            ]
        })
        .then(master=>{
            req.master = master;
            next();
        })
    },
    mastersIndex: (req,res)=>{
        db.Master.findAndCountAll({
            include: [
                {
                    model: db.User,
                    as: 'user'
                }
            ]
        })
        .then(masters=>{
            console.log(masters.rows);
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
            db.Master.create({
                name: req.body.name,
                authority: req.body.authority,
            })
            .then((master)=>{
                res.redirect("/sites/masters");
            })
            .catch(db.Sequelize.ValidationError, function (err) {
                console.log(err);
            });
        })
       
    },

    mastersShow: (req,res)=>{
        objData = {master: req.master};
        res.render("6_sites/master_show", objData);
    },
    mastersUpdate: (req,res)=>{
        req.master.update(req.body)
        .then(()=>{
            res.redirect('/sites/masters');
        });
    },
    //stores - delete
    mastersDelete: (req,res)=>{
        req.master.destroy();
        res.redirect('/sites/masters');
    },

    mastersMultipleDelete: (req,res)=>{
        let masters = req.body.checked.toString().split(',');
        for(var i = 0 ; i < masters.length; i++){
            db.Master.findById(masters[i])      
            .then(master=>{
                master.destroy();
            });
        };
        res.redirect('/sites/masters');
    },
    
}