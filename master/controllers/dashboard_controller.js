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
        })    
        .then(()=>{
            db.Visiting.count({
                where: {
                    visitedAt: today
                }
            })
            .then(visitings=>{
                objData.visitings = visitings;
            })
        })
        .then(()=>{
            //나중에 서버 올리면 cron으로 DB화 하는 게 
            db.Viewcount.count({
                where: {
                    viewedAt: today
                }
            })
            .then(views=>{
                objData.views = views;
                
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
                }
            }).then(newOrders=>{
                objData.newOrders = newOrders? newOrders : 0;
            })
        })//입금확인중
        .then(()=>{
            db.Order.count({
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
        })//서비스이용중
        .then(()=>{
            let limit = new Date();
            let today = new Date();
            limit.setDate(limit.getDate()-3);
            db.Order.count({
                where: {
                    startDate: {[Op.lte]: today},
                    endDate: {[Op.gte]: limit},
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
        })//스토어현황 - 전체스토어
        .then(()=>{
            db.Store.count({
                where: {
                    approvalChk: true
                },
            }).then(stores=>{
                objData.stores = stores? stores : 0;
            })
        })//스토어현황 - 신규승인요청
        .then(()=>{
            db.Store.count({
                where: {
                    approvalChk: false
                },
            }).then(prestores=>{
                objData.prestores = prestores? prestores : 0;
            })
        })//회원현황 - 전체회원
        .then(()=>{
            db.User.count({
                
            }).then(users=>{
                objData.users = users? users : 0;
            })
        })//회원현황 - 신규가입
        .then(()=>{
            let limit = new Date();
            let today = new Date();
            limit.setDate(limit.getDate()-1);
            db.User.count({
                where: {
                    createdAt: {[Op.lte]: today},
                    createdAt: {[Op.gte]: limit},
                }                
            }).then(newUsers=>{
                objData.newUsers = newUsers? newUsers : 0;
                res.render('dashboard', objData);    
            })
        })//회원현황 - 휴면회원
        .then(()=>{
        })
                 
    }
}