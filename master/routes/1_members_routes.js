module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/1_members_controller');
    const msgLibrary = require('../../lib/message_functions');
    // route.get('/sendMessages', controller.sendMessages);
    route.post('/sendMessages', controller.sendMessage);
    //users - index
    route.get('/users', controller.usersIndex)
        .post('/users', controller.writeMessages);
    //users - show, update
    route.get('/users/:user_id', controller.findUser, controller.usersShow)
        .post('/users/:user_id', controller.findUser, controller.usersUpdate);   
    //users - delete
    route.get('/users/:user_id/delete', controller.findUser, controller.usersDelete);
    //users - send messages
    // route.post('/users/sendMessages', controller.sendUsersMessages);
    //공통인데 어떻게 구현할지 생각해보자. 

    //providers - index
    route.get('/providers', controller.providersIndex)
        .post('/providers', controller.writeMessages);
    //providers - show, update
    route.get('/providers/:provider_id',  controller.findProvider, controller.providersShow)
        .post('/providers/:provider_id', controller.findProvider, controller.providersUpdate);
    //providers - delete
    route.get('/providers/:provider_id/delete', controller.findProvider, controller.providersDelete);
    // //providers - send messages

    //stores - index
    route.get('/stores', controller.storesIndex);
    //stores - show
    route.get('/stores/:store_id', controller.findStore, controller.storesShow)
        .post('/stores/:store_id/', controller.findStore, controller.storesUpdate);
    //stores - delete
    route.get('/stores/:id/delete', controller.findStore, controller.storesDelete);
    
    return route; 
}