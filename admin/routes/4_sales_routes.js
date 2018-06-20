module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/4_sales_controller');

    route.get('/all', controller.allIndex);
    route.get('/balance', controller.balanceIndex);
    route.get('/withdraw', controller.withdrawIndex);

    return route; 
}