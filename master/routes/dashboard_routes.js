module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/dashboard_controller');

    route.get('', controller.dashboardIndex);
    return route; 
}