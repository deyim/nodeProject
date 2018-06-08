module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/7_codes_controller');

    route.get('/products', controller.productcodesIndex);
    route.get('/products/add', controller.productcodesAdd);
    route.get('/products/generate', controller.productcodesGenerate);
    
    route.get('/orders', controller.ordercodesIndex);
    route.get('/orders/add', controller.ordercodesAdd);
    route.get('/orders/generate', controller.ordercodesGenerate);

    route.get('/notices', controller.noticecodesIndex);
    route.get('/notices/add', controller.noticecodesAdd);
    route.get('/notices/generate', controller.noticecodesGenerate);

    route.get('/faqs', controller.faqcodesIndex);
    route.get('/faqs/add', controller.faqcodesAdd);
    route.get('/faqs/generate', controller.faqcodesGenerate);


    return route;
}