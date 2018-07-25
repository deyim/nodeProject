module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/5_sites_controller');

    route.get('/store', controller.findStore, controller.storeShow)
        .post('/store', controller.storeUpdate);

    route.get('/notices', controller.noticesIndex);
    route.get('/notices/:notice_id', controller.findNotice, controller.noticeShow)

    route.get('/faqs', controller.faqsIndex);
    route.get('/faqs/:faq_id', controller.findFaq, controller.faqShow)

    return route; 
}