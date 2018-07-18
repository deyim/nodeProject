const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op
const perPage = 5;
const dateFunctions = require('../../lib/date_functions');

module.exports = {
    dashboardIndex: (req,res)=>{
        // var today = dateFunctions.getToday();
        var today = new Date();
        var objData = {}
        var dailyViews = [], monthlyViews = [], dailyVisitings = [], monthlyVisitings = [];

        db.Notice.findAll()
        .then(notices=>{
            objData.notices = notices.slice(0,5);
            
        })
        .then(()=>{
            db.Faq.findAll()
            .then(faqs=>{
                objData.faqs = faqs.slice(0,5);
            })
        })//결제금액
        .then(()=>{
            db.Order.sum('price',{
                where: {
                    id: res.locals.store.id
                }
            })
            .then(sum=>{objData.sales = sum?sum:0;});
        })//취소환불금액
        .then(()=>{
            db.Order.sum('price',{
                where: {
                    id: res.locals.store.id
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: {
                            cancelChk: true
                        },
                        attributes: []
                    }
                ]
            })
            .then(sum=>{
                console.log(sum);
                objData.cancelSales = sum? sum : 0;
            });
        })//방문자수 
        .then(()=>{
            db.StoreVisit.count({
                where: {
                    storeId: res.locals.store.id,
                    visitedAt: today
                }
            })
            .then(visitings=>{
                objData.visitings = visitings;
            })
        })//상품조회
        .then(()=>{
            //나중에 서버 올리면 cron으로 DB화 하는 게 
            db.Viewcount.count({
                where: {
                    viewedAt: today
                },
                include: [
                    {
                        model: db.Product,
                        as: 'product',
                        include: [
                            {
                                model: db.Store,
                                as: 'store',
                                where: {
                                    id: res.locals.store.id
                                }
                            }
                        ]
                    }
                ]
            })
            .then(views=>{
                objData.views = views ? views: 0;
                
            })
        })//결제건수
        .then(()=>{
            let limit = new Date();
            let today = new Date();
            limit.setDate(limit.getDate()-1);
            db.Order.count({
                where: {
                    startDate: {[Op.lte]: today},
                    endDate: {[Op.gte]: limit},
                    storeId: res.locals.store.id
                }
            }).then(newOrders=>{
                objData.newOrders = newOrders? newOrders : 0;
            })
        })//결제금액
        .then(()=>{
        })//입금확인중
        .then(()=>{
            db.Order.count({
                where:{
                    storeId: res.locals.store.id
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: false 
                        }
                    },
                ]
            }).then(ordered=>{
                objData.ordered = ordered? ordered : 0;
            })
        })//신규주문
        .then(()=>{
            db.Order.count({
                where: {
                    storeId: res.locals.store.id
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: false 
                        }
                    },
                ]
            }).then(paid=>{
                objData.paid = paid? paid : 0;
            })
        })//미확인주문
        .then(()=>{
            db.Order.count({
                where:{
                    storeId: res.locals.store.id
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeChk: false
                        }
                    },
                ]
            }).then(unchecked=>{
                objData.unchecked = unchecked? unchecked : 0;
            })
        })//서비스이용중
        .then(()=>{
            let limit = new Date();
            let today = new Date();
            limit.setDate(limit.getDate()-3);
            db.Order.count({
                where: {
                    startDate: {[Op.lte]: today},
                    endDate: {[Op.gte]: limit},
                    storeId: res.locals.store.id
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeChk: true,
                            cancelChk: false, 
                        }
                    },
                ]
            }).then(used=>{
                objData.used = used? used : 0;                
            })
        })//구매확정
        .then(()=>{
            var limit = new Date();
            limit.setDate(limit.getDate()+3);
            db.Order.count({
                where: {
                    endDate: {[Op.lt]: limit},
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            paidChk: true,
                            placeChk: true,
                            finalChk: true
                        },
                    },
                ]
            }).then(final=>{
                objData.final = final?  final : 0;
            })
        })//취소/환불
        .then(()=>{
            db.Order.count({
                where:{
                    storeId: res.locals.store.id
                },
                include: [
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        where: { 
                            cancelChk: true
                        }
                    },
                ]
            }).then(canceled=>{
                objData.canceled = canceled? canceled : 0;
                                   
            })
        })//회원현황 - 전체회원
        .then(()=>{
            db.User.count({
                include: [
                    {
                        model: db.Store,
                        as: 'stores',
                        where: {
                            id: res.locals.store.id
                        }
                    }
                ]
            }).then(users=>{
                objData.users = users? users : 0;
                
            })
        })//회원현황 - 신규가입
        .then(()=>{
            let limit = new Date();
            let today = new Date();
            limit.setDate(limit.getDate()-1);
            db.User.count({
                include: [
                    {
                        model: db.Store,
                        as: 'stores',
                        required: true,
                        through: { 
                            where: {
                                storeId: res.locals.store.id,
                                createdAt: {[Op.lte]: today},
                                createdAt: {[Op.gte]: limit},
                            },
                            attributes: ['createdAt','orderCnt']
                        },
                    }
                ],         
            }).then(newUsers=>{
                objData.newUsers = newUsers? newUsers : 0;
               
            })
        })//회원현황 - 탈퇴회원
        .then(()=>{
            db.User.count({
                include: [
                    {
                        model: db.Store,
                        as: 'stores',
                        required: true,
                        paranoid: false,
                        through: { 
                            where: {
                                storeId: res.locals.store.id,
                            },
                            attributes: ['createdAt','orderCnt']
                        },
                    }
                ],         
            }).then(droppedUsers=>{
                objData.droppedUsers = droppedUsers? droppedUsers : 0;
                res.render('dashboard', objData); 
            })
            
        })
                 
    }
}