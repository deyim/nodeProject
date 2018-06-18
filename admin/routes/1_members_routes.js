module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/1_members_controller');
   
    route.post('/sendMessages', controller.sendMessage);
    //users - index
    route.get('/users', controller.usersIndex)
        .post('/users', controller.writeMessages);
    //users - show, update
    route.get('/users/:user_id', controller.findUser, controller.usersShow)
    //users - delete
    route.get('/users/:user_id/delete', controller.findUser, controller.usersDelete);
    //users - send messages
    // route.post('/users/sendMessages', controller.sendUsersMessages);
    //공통인데 어떻게 구현할지 생각해보자. 

    return route; 
}