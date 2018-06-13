const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 5;

module.exports = {
    findStore: (req,res,next)=>{
        db.Store.findById(req.params.store_id)
        .then(store=>{
            if(!store){
                req.flash('error', '없는 스토어입니다.');
                res.redirect('/approvals/stores');
            }
            req.store = store;
            store.getApproval()
            .then(approval=>{
                req.approval = approval;
                next();
            });
        });       
    },
    storesIndex: (req,res)=>{
        let q = req.query;
        let page = q.page||1;
        delete q.page;     
        if(Object.keys(req.query).length === 0){
            db.Store.findAndCountAll({
                limit: perPage,
                offset: perPage*(page-1),
                where:{
                    approvalChk: false
                }                
            })
            .then(stores=>{
                objData = {stores:stores.rows, storesCnt:stores.count};
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
                        {createdAt: {
                                [Op.and]:[
                                    {[Op.gte]: q.startdate ? q.startdate : "1900-03-25"},
                                    {[Op.lte]: q.enddate ? q.enddate : "2100-03-25"},
                                ]
                            }
                        },
                        {url:  { [Op.like]: `%${q.url}%` }},
                    ]                    
                },
                include: [//provider 의 id, 사업자명, 회원유형
                    {
                        model: db.Provider,
                        as: 'provider',
                        where: {
                            [Op.and]:
                            [
                                {companyName:{ [Op.like]: `%${q.companyName}%`}},
                                {companyType:{ [Op.like]: `%${q.companyType}%`}},
                            
                            ]
                        },
                        include: [
                            {
                                model: db.User,
                                as: 'user',
                                where: {
                                    [Op.and]:
                                    [
                                        {username:{ [Op.like]: `%${q.username}%`}},
                                    ]
                                }
                            }
                        ]
                        
                    }
                ]
            })
            .then(stores=>{ 
                objData = {stores:stores.rows, storesCnt:stores.count};
                res.render('2_approvals/stores_index', objData);
            })
        }
    },

    storesShow: (req,res)=>{
        objData = {store:req.store, approval:req.approval}
        res.render('2_approvals/stores_show', objData);
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