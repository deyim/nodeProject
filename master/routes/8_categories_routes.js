module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/8_categories_controller');

    route.get('/', controller.categoryIndex);
    route.post('/add', controller.categoryAdd);
    route.post('/edit/:id',  controller.findCategory, controller.categoryEdit);
    route.get('/delete/:id',  controller.findCategory, controller.categoryDelete);
   

    return route;
}