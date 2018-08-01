module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/5_sales_controller');
   
    route.get('/all', controller.salesAllIndex);
    
    route.get('/each', controller.salesEachReady);  
    route.get('/each/:store_url', controller.salesEachIndex);
    
    route.get('/distribute', controller.salesDistribute);
    route.get('/distribute/:withdrawl_id', controller.salesDistributedOrders);
    
    //distribute page 상세내역 보기 누를 시
    route.get('/withdraw/:withdraw_id', controller.salesWithdrawlShow);

    route.get('/withdrawl', controller.salesWithdrawl);
    return route;
}