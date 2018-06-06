const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op

module.exports = {
    findStore: (req,res,next)=>{
        db.Approval.findOne({
            include: [
                {
                    model: db.Store,
                    as: 'store',
                    foreignKey: 'storeId',
                    where: {
                        id: req.params.store_id
                    }
                }
            ]
        })
        .then(approaval=> {
            req.approval = approval;
            db.Store.findById(req.params.store_id)
            .then(store=>{
                if(!store){
                    req.flash('error', '없는 스토어입니다.');
                    res.redirect('/approvals/stores');
                }
                req.store = store;
                next();
            })
        })        
    },
    storesIndex: (req,res)=>{
        
        if(Object.keys(req.query).length === 0){
            db.Store.findAll({
                where:{
                    approvalChk: false
                }                
            })
            .then(stores=>{
                res.render('2_approvals/stores_index', {stores});
            });   
        }      
        else{
            let q = req.query;
            db.Store.findAll({
                // [Op.or]:[{
                    where:{
                        [Op.and]:[
                            {
                                approvalChk: false
                            },
                            {
                                [Op.or]:
                                    [
                                        {createdAt: {
                                                [Op.gte]: q.startdate ? q.startdate : null,
                                                [Op.lte]: q.enddate ? q.enddate : null,
                                            }
                                        },
                                        { url: q.url }
                                    ]
                            }  
                        ]             
                    },
                    // include: [//provider 의 id, 사업자명, 회원유형
                    //     {
                    //         [Op.or]:
                    //         [
                    //             // {model: Provider, where:{username: q.username}},
                    //             {model: db.Provider, where:{companyName: q.companyName}},
                    //             {model: db.Provider, where:{companyType: q.companyType}},
                    //         ]
                    //     }
                    // ]
                // }]
            })
            .then(stores=>{
                res.render('2_approvals/stores_index', {stores});
            })
        }
    },

    storesShow: (req,res)=>{
        res.render('2_approvals/stores_show',{store:req.store, approval:req.approval});
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
        res.redirect('/members/users');
    }
    
}