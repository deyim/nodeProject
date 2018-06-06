module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/4_orders_controller');

    입금확인중 / 신규주문 / 발주확인 / 서비스 이용중 / 구매확정 / 취소/환불

    //products - index
    route.get('/products', controller.productsIndex);
    //products - show
    route.get('/products/:id', controller.findProduct, controller.productsShow);
    //products - update
    route.post('/products/:id/', controller.findProduct, controller.productsUpdate);
    //products - delete
    route.get('/products/:id/delete', controller.findProduct, controller.productsDelete);

    
//complicated..

    return route;
}