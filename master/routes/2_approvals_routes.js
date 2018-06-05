module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/2_approvals_controller');

    //stores - index
    route.get('/stores', controller.storesIndex);
    //stores - show
    route.get('/stores/:id', controller.findStore, controller.storesShow);
    //stores - delete
    route.get('/stores/:id/delete', controller.findStore, controller.storesDelete);
    

    return route;
}