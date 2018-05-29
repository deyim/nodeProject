module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/4_orders_controller');

    // //products - index
    // route.get('/products', controller.productsIndex);
    // //products - show
    // route.get('/products/:id', controller.findProduct, controller.productsShow);
    // //products - update
    // route.post('/products/:id/', controller.findProduct, controller.productsUpdate);
    // //products - delete
    // route.get('/products/:id/delete', controller.findProduct, controller.productsDelete);

    
//complicated..

    return route;
}