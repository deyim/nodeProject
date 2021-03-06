module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/3_orders_controller');

    // 입금확인중 / 신규주문 / 발주확인 / 서비스 이용중 / 구매확정 / 취소/환불
    route.get('/users/:order_id', controller.orderServiceUsers);
    //ordered - index
    route.get('/ordered', controller.orderedIndex)
        .post('/ordered', controller.orderedStatusChange);
    // //ordered - show
    // route.get('/ordered/:id', controller.orderedShow);

    //paid - index
    route.get('/paid', controller.paidIndex)
        .post('/paid', controller.paidStatusChange);
    // route.get('/paid/:order_id/add_voucher', controller.addVoucher);
    //paid - show
    // route.get('/paid/:id', controller.paidShow);

    //placed - index
    route.get('/placed', controller.placedIndex)
        // .post('/placed', controller.placedStatusChange);
    //placed - show
    // route.get('/placed/:id', controller.placedShow);
    
    //used - index
    route.get('/used', controller.usedIndex)
        // .post('/used', controller.usedStatusChange);
    //used - show
    // route.get('/used/:id', controller.usedShow);

    //final - index
    route.get('/final', controller.finalIndex);
    //final - show
    // route.get('/final/:id', controller.finalShow);

    //cancel - index
    route.get('/canceled', controller.cancelIndex)
        .post('/canceled', controller.cancelStatusChange);
    //cancel - show
    // route.get('/cancel/:id', controller.cancelShow);
   
//complicated..

    return route;
}