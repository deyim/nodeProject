module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/2_approvals_controller');

    //stores - index
    route.get('/stores', controller.storesIndex)
        .post('/stores', controller.storesApproveOrDelete);
    //stores - show
    route.get('/stores/:store_id', controller.findStore, controller.storesShow);
    //stores - delete
    route.get('/stores/:store_id/delete', controller.findStore, controller.storesDelete);
    

    return route;
}