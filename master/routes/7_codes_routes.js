module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/7_codes_controller');

    route.get('/products', controller.productcodesIndex);
    route.get('/products/add', controller.productcodesAdd);
    route.post('/products/generate', controller.productcodesGenerate);
    
    route.get('/orders', controller.ordercodesIndex);
    route.get('/orders/add', controller.ordercodesAdd);
    route.post('/orders/generate', controller.ordercodesGenerate);

    route.get('/notices', controller.noticecodesIndex);
    route.get('/notices/delete/:id', controller.noticecodesDelete);
    route.post('/notices/generate', controller.noticecodesGenerate);

    route.get('/faqs', controller.faqcodesIndex);
    route.get('/faqs/delete/:id', controller.faqcodesDelete);
    route.post('/faqs/generate', controller.faqcodesGenerate);


    return route;
}