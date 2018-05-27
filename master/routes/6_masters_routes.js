module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/6_masters_controller');

    //masters - index
    route.get('/', controller.mastersIndex);
    //masters - show
    route.get('/:user_id', controller.findMaster, controller.mastersShow);    
    //masters - update
    route.post('/:user_id', controller.findMaster, controller.mastersUpdate);
    //masters - delete
    route.get('/:user_id/delete', controller.findMaster, controller.mastersDelete);
 
    
    return route; 
}