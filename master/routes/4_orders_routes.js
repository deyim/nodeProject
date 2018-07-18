module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/4_orders_controller');

    // 입금확인중 / 신규주문 / 발주확인 / 서비스 이용중 / 구매확정 / 취소/환불
    route.get('/users/:order_id', controller.orderServiceUsers);
   
    //입금확인중: ordered - index
    route.get('/ordered', controller.orderedIndex);
    
    //신규주문: paid - index
    route.get('/paid', controller.paidIndex);
   
    //발주확인: placed - index
    route.get('/placed', controller.placedIndex);
    
    //서비스 이용중: used - index
    route.get('/used', controller.usedIndex);
    
    //구매화정: final - index
    route.get('/final', controller.finalIndex);
    
    //취소 환불: cancel - index
    route.get('/cancel', controller.cancelIndex);

    return route;
}