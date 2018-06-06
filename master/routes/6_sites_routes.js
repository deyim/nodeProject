module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/6_sites_controller');

    route.get('/banners', controller.bannersIndex);
    route.get('/banners/adstory/add', controller.adstoryAdd)
        .post('/banners/adstory/add', controller.adstoryCreate);
    route.get('/banners/adstory/:adstory_iddelete/', controller.adstoryDelete);

    route.get('/banners/adstore/add', controller.adstoreAdd)
        .post('/banners/adstore/add', controller.adstoreCreate);
    route.get('/banners/adstore/:adstore_iddelete/', controller.adstoreDelete);

    route.get('/banners/adnewstore/add', controller.adnewstoreAdd)
        .post('/banners/adnewstore/add', controller.adnewstoreCreate);
    route.get('/banners/adnewstore/:adnewstore_iddelete/', controller.adnewstoreDelete);

    route.get('/banners/adaffiliation/add', controller.adaffiliationAdd)
        .post('/banners/adaffiliation/add', controller.adaffiliationCreate);
    route.get('/banners/adaffiliation/:adafiliation_id/delete/', controller.adaffiliationDelete);


    route.get('/notices', controller.noticesIndex);
    route.get('/notices/add', controller.noticeAdd)
        .post('/notices/add', controller.noticeCreate);
    route.get('/notices/:notice_id', controoller.findNotice, controller.noticeShow)
        .post('/notices/:notice_id', controoller.findNotice, controller.noticeUpdate);
    route.get('notices/:notice_id/delete', controller.findNotice, controller.noticeDelete);

    route.get('/faqs', controller.faqsIndex);
    route.get('/faqs/add', controller.faqeAdd)
        .post('/faqs/add', controller.faqCreate);
    route.get('/faqs/:notice_id', controoller.findFaq, controller.faqShow)
        .post('/faqs/:notice_id', controoller.findFaq, controller.faqUpdate);
    route.get('/faqs/:notice_id/delete', controller.findFaq, controller.faqDelete);

    

    //masters - index
    route.get('/masters', controller.mastersIndex);
    //masters - show
    route.get('/masters/:master_id', controller.findMaster, controller.mastersShow)
        post('/masters/:master_id', controller.findMaster, controller.mastersUpdate);
    //masters - delete
    route.get('/masters/:master_id/delete', controller.findMaster, controller.mastersDelete);
 
    
    return route; 
}