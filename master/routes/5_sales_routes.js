module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/5_sales_controller');
   
    route.get('/all', controller.salesAllIndex);
    route.get('/each', controller.salesEachReady);  
    route.get('/each/:store_url', controller.salesEachIndex);
    route.get('/distribute', controller.salesDistribute);
    route.get('/distribute/:withdrawl_id', controller.salesDistributedOrders);
    route.get('/withdrawl', controller.salesWithdrawl);
    return route;
}