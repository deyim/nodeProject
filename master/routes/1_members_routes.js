module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const membersController = require('../controllers/1_members_controller');

    //users - index
    route.get('/users', membersController.usersIndex);
    //users - search
    // route.get('/users/', membersController.usersSearch);
    //users - show
    route.get('/users/:user_id', membersController.findUser, membersController.usersShow);    
    //users - update
    route.post('/users/:user_id', membersController.findUser, membersController.usersUpdate);
    //users - delete
    route.get('/users/:user_id/delete', membersController.findUser, membersController.usersDelete);
    //users - send messages
    //공통인데 어떻게 구현할지 생각해보자. 

    //providers - index
    route.get('/providers', membersController.providersIndex);
    //providers - search
    route.get('/1', membersController.providersSearch);
    //providers - create
    // route.post('/providers/create', membersController.providersCreate);
    //providers - show
    // route.get('/providers/:id', membersController.providersShow);
    //providers - edit
    route.get('/providers/:id/edit', membersController.providersEdit);
    //providers - update
    route.put('/providers/:id/update', membersController.providersUpdate);
    //providers - delete
    // route.delete('/providers/:id/delete', membersController.providersDelete);
    // //providers - send messages

    //stores - index
    route.get('/stores', membersController.storesIndex);
    //stores - search
    route.get('/1', membersController.storesSearch);
    //stores - show
    route.get('/stores/:id', membersController.storesShow);
    //stores - edit
    route.get('/stores/:id/edit', membersController.storesEdit);
    //stores - update
    route.put('/stores/:id/update', membersController.storesUpdate);
    //stores - delete
    // route.delete('/stores/:id/delete', membersController.storesDelete);
    
    return route;
}