const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 5;

module.exports = {
    findStore: (req,res,next)=>{ 
        db.Store.findOne({
            where: {
                id: res.locals.store.id
            },
            include: [
                {
                    model: db.Provider,
                    as: 'provider'
                },
                {
                    model: db.User,
                    as: 'users'
                },
                {
                    model: db.Nation,
                    as: 'nations'
                },
                {
                    model: db.City,
                    as: 'cities'
                },
                {
                    model: db.StoreFile,
                    as: 'storeFiles'
                }
            ]
        }).then(store=>{
            req.store = store;
            next();
        })
        //회원 정보도 다 가져와야돼??
        
    },

    storeShow: (req,res)=>{
        
        objData = {store:req.store, provider:req.store.provider, 
            store_nations:req.store.nations, store_cities:req.store.cities};
        db.Nation.findAll()
        .then(nations=>{objData.nations = nations});
        db.City.findAll()
        .then(cities=>{objData.cities = cities; 
            res.render('5_sites/stores_show',objData);
        });
        
    },

    storeUpdate: (req,res)=>{
        if(req.body.storeLogoPath){
            db.Store.findOne({
                where: {
                    id: res.locals.store.id
                },
            }).then(store=>{
                store.update({
                    storeLogoPath: req.body.storeLogoPath,
                })
                res.redirect('/sites/store');
            })
            
        }
        else if(req.body.storeImgPath){
            db.Store.findOne({
                where: {
                    id: res.locals.store.id
                },
            }).then(store=>{
                store.update({
                    storeImgPath: req.body.storeImgPath,
                })
                res.redirect('/sites/store');
            })
        }
        else{
            db.Store.findOne({
                where: {
                    id: res.locals.store.id
                },
            }).then(store=>{
                store.update({
                    introduction: req.body.introduction,
                   
                })
            })
            .then(()=>{
                db.Provider.findOne({
                    include: [
                        {
                            model:db.Store,
                            as: 'store',
                            id: res.locals.store.id
                        }
                    ]
                }).then(provider=>{
                    provider.update({
                        companyNumber: req.body.companyNumber,
                        companyName: req.body.companyName,
                        businessType: req.body.businessType,
                        businessCategory: req.body.businessCategory,
                        commuNumber: req.body.commuNumber,
                        CEONumber: req.body.CEONumber,
                        faxNumber: req.body.faxNumber,
                        staffName: req.body.staffName,
                        staffNumber: req.body.staffNumber,
                        accountNumber: req.body.accountNumber,
                        accountName: req.body.accountName,
                        accountBank: req.body.accountBank,
                        frNation: req.body.frNation,
                        frCity: req.body.frCity,
                        frPhone: req.body.frPhone

                    })
                })
            })
            res.redirect('/sites/store');
        }
        
    },
      
    findNotice: (req,res,next)=>{
        db.Notice.findById(req.params.notice_id)
        .then(notice=>{
            req.notice = notice;
            db.Noticecode.findAll()
            .then(codes=>{                
                req.noticecodes = codes;
                next();
            });
        })
    },

    noticesIndex: (req,res)=>{
        console.log(req.query);
        let q = req.query;
        let page = q.page||1;
        delete q.page;  
        if(Object.keys(req.query).length === 0){
            db.Notice.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.Noticecode,
                        as: 'noticecode'
                    }
                ]
            })
            .then(notices=>{
                // console.log('\n\n\n****',notices);
                db.Noticecode.findAll()
                .then(codes=>{                    
                    objData = {notices:notices.rows, noticesCount: notices.count, noticecodes:codes};
                    res.render('5_sites/notices_index', objData);
                });                
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
                            code: { [Op.like]: `%${q.code}%` }
                        }
                    }
                ],
                where: {
                    type: { [Op.like]: `%${q.type}%` }
                }
            })
            .then(notices=>{
                console.log(notices);
                db.Noticecode.findAll({
                })
                .then(codes=>{
                    objData = {notices:notices.rows, noticesCount: notices.count, noticecodes:codes};
                    res.render('5_sites/notices_index', objData);
                });   
            });
        }
        
    },

    noticeShow: (req,res)=>{
        notice = req.notice;
        codes = req.noticecodes;
        res.render("5_sites/notices_show", {notice:notice,codes:codes});
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
                offset: perPage*(page-1),
                include: [
                    {
                        model: db.FAQcode,
                        as: 'faqcode'
                    }
                ]
            })
            .then(faqs=>{
                db.FAQcode.findAll({
                })
                .then(codes=>{                    
                    objData = {faqs:faqs.rows, faqsCount: faqs.count, faqcodes:codes};
                    res.render('5_sites/faqs_index', objData);
                });                
            });
        }
        else{
            let type;
            if(q.type === "사용자"){
                type = "A"
            }else if(q.type === "스토어"){
                type = "B";
            }else{
                type = "";
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
                    type: { [Op.like]: `%${q.type}%` }
                }
            })
            .then(faqs=>{
                console.log('\n\n***', faqs, q.code);
                db.FAQcode.findAll({
                })
                .then(codes=>{
                    objData = {faqs:faqs.rows, faqsCount: faqs.count, faqcodes:codes};
                    res.render('5_sites/faqs_index', objData);
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

    faqShow: (req,res)=>{
        objData = {faq:req.faq, code:req.code};
        res.render("5_sites/faqs_show",objData);
    },

     
}