module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/6_sites_controller');

    //sites - banners
    route.get('/banners', controller.bannersIndex);
    route.post('/banners/adstory/add', controller.adstoryCreate);
    route.get('/banners/adstory/:adstory_id/delete/', controller.adstoryDelete);

    route.post('/banners/adstore/add', controller.adstoreCreate);
    route.get('/banners/adstore/:adstore_id/delete/', controller.adstoreDelete);

    route.post('/banners/adnewstore/add', controller.adnewstoreCreate);
    route.get('/banners/adnewstore/:adnewstore_id/delete/', controller.adnewstoreDelete);

    route.post('/banners/adaffiliation/add', controller.adaffiliationCreate);
    route.get('/banners/adaffiliation/:adaffiliation_id/delete/', controller.adaffiliationDelete);

    //sites - notices
    route.get('/notices', controller.noticesIndex)
        .post('/notices', controller.noticeMultipleDelete);
    route.get('/notices/add', controller.noticeAdd)
        .post('/notices/add', controller.noticeCreate);
    route.get('/notices/:notice_id', controller.findNotice, controller.noticeShow)
        .post('/notices/:notice_id', controller.findNotice, controller.noticeUpdate);
    route.get('/notices/:notice_id/delete', controller.findNotice, controller.noticeDelete);

    //sites - faqs
    route.get('/faqs', controller.faqsIndex)
        .post('/faqs', controller.faqsMultipleDelete);
    route.get('/faqs/add', controller.faqAdd)
        .post('/faqs/add', controller.faqCreate);
    route.get('/faqs/:faq_id', controller.findFaq, controller.faqShow)
        .post('/faqs/:faq_id', controller.findFaq, controller.faqUpdate);
    route.get('/faqs/:faq_id/delete', controller.findFaq, controller.faqDelete);

    //masters - index
    route.get('/masters', controller.mastersIndex)
        .post('/masters', controller.mastersMultipleDelete);
    route.get('/masters/add', controller.mastersAdd)
        .post('/masters/add', controller.mastersCreate);
    route.get('/masters/:master_id', controller.findMaster, controller.mastersShow)
        .post('/masters/:master_id', controller.findMaster, controller.mastersUpdate);
    route.get('/masters/:master_id/delete', controller.findMaster, controller.mastersDelete);
 
    
    return route; 
}