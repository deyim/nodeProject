module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/8_categories_controller');

    route.get('/', controller.categoryIndex);
    // route.get('/communications/add', controller.commuAdd);
    // route.get('/communications/edit', controller.commuEdit);
    // route.get('/communications/delete', controller.commuDelete);

    // route.get('/notices/add', controller.noticeAdd);
    // route.get('/notices/edit', controller.noticeEdit);
    // route.get('/notices/delete', controller.noticeDelete);

    route.post('/add', controller.categoryAdd);
    route.get('/edit/:id',  controller.findCategory, controller.categoryEdit);
    route.get('/delete/:id',  controller.findCategory, controller.categoryDelete);
   

    return route;
}