module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/6_categories_controller');

    route.get('/', controller.categoriesIndex);
    
    return route; 
}