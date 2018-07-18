const db = require('../../models/index');
//const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 10;
const dateFunctions = require('../../lib/date_functions');

module.exports = {
    /***********************
          approval/store
    ***********************/
    //find store
    findStore: (req,res,next)=>{ 
        db.Store.findOne({
            where: {
                id: req.params.store_id,
            },
            include: [
                {
                    model:db.Provider,
                    as: 'provider'
                },
                {
                    model: db.Nation,
                    as: 'nations'
                },
                {
                    model: db.City,
                    as: 'cities',
                },
                {
                    model: db.Approval,
                    as: 'approval'
                }
            ]
        })
        .then(store=>{
            req.store = store;
            next();
        })
        
    },

    //stores - index
    storesIndex: (req,res)=>{
        let firstday = dateFunctions.getFirstday();
        let q = req.query;
        let page = q.page||1;
        delete q.page;     
        if(Object.keys(req.query).length === 0){
            db.Store.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where:{
                    approvalChk: false
                },
                include: [
                    {
                        model: db.Provider,
                        as: 'provider',
                        include: [
                            {
                                model: db.User,
                                as: 'user'
                            }
                        ]
                    }
                ]               
            })
            .then(stores=>{
                objData = {stores:stores.rows, storesCnt:stores.count, firstday, q};
                res.render('2_approvals/stores_index', objData);
            });   
        }      
        else{
            let q = req.query;
            db.Store.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where:{
                    [Op.and]:
                    [
                        {approvalChk: false},
                        {createdAt: {
                                [Op.and]:[
                                    {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                    {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                ]
                            }
                        },
                        {url:  q.url? { [Op.like]: `%${q.url}%` } : {[Op.regexp]: '^'}},
                    ]                    
                },
                include: [//provider 의 id, 사업자명, 회원유형
                    {
                        model: db.Provider,
                        as: 'provider',
                        where: {
                            [Op.and]:
                            [
                                {companyName: q.companyName? { [Op.like]: `%${q.companyName}%` } : {[Op.regexp]: '^'}},
                                {companyType: q.companyType? { [Op.like]: `%${q.companyType}%` } : {[Op.regexp]: '^'}},
                            
                            ]
                        },
                        include: [
                            {
                                model: db.User,
                                as: 'user',
                                where: {
                                    [Op.and]:
                                    [
                                        {username: q.username? { [Op.like]: `%${q.username}%` } : {[Op.regexp]: '^'}},
                                    ]
                                }
                            }
                        ]
                        
                    }
                ]
            })
            .then(stores=>{ 
                objData = {stores:stores.rows, storesCnt:stores.count, firstday, q};
                res.render('2_approvals/stores_index', objData);
            })
        }
    },

    //stores - show
    storesShow: (req,res)=>{
        objData = {store:req.store}
        res.render('2_approvals/stores_show', objData);
    },

    //stores - update
    storesUpdate: (req,res)=>{
        let provider;
        db.Provider.findOne({
            include :[
                {
                    model: db.Store,
                    as: 'store',
                    where: {
                        id:req.params.store_id
                    }
                }
            ]
        }).then(provider_ => {
            provider = provider_
        }).then(()=>{
            provider.update(
                {
                    rateType: req.body.rateType,
                    monthRate: req.body.monthRate,
                    monthFee: req.body.monthFee,
                    // approvalChk: true,
                    // approvalDate: Date.now()
                }
            )
            .then(()=>{
                res.redirect(`/approvals/stores/`);
            })
        });
    },

    //select -> approvalChk to true, approvalDate change(additional column)
    //select -> approvalChk 
            //need denied alarm -> 
            //approval check만 담당하는 테이블을 => requestDate, deniedChk, storeId, providerId
    //stores - delete
    storesDelete: (req,res)=>{
        approval.update({
            deniedChk: true,
        })
        res.redirect('/approvals/stores');
    },

    //store multiple approval or deletion
    storesApproveOrDelete: (req,res)=>{
        stores = req.body.checked.toString().split(',');
        if(req.body.approve){
            for(var i = 0 ; i < stores.length; i++){
                db.Store.findById(stores[i])
                .then(store=>{
                    store.update({
                        approvalChk: true,
                        approvalDate: Date.now()
                    });
    
                    store.getApproval()
                    .then(approval=>{
                        approval.update({
                            deniedChk: false
                        })
                    });
                });
            };
        }
        else{
            for(var i = 0 ; i < stores.length; i++){
                db.Store.findById(stores[i])
                .then(store=>{
                    store.update({
                        approvalChk: false,
                    });
    
                    store.getApproval()
                    .then(approval=>{
                        approval.update({
                            deniedChk: true
                        })
                    });
                });
            };
        }
        res.redirect('/approvals/stores');
    }
    
}