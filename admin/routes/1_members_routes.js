module.exports = ()=>{
    const express = require('express');
    const route = express.Router();

    //users - index
    route.get('/users', (req,res)=>{
        res.render('1_members/users_index');
    });
    //users - search
    //users - create
    //users - show
    route.get('/users/:id', (req,res)=>{
        res.render('1_members/users_show');
    });
    
    //users - edit
    route.get('/users/:id', (req,res)=>{
        res.render('1_members/users_edit');
    });
    //users - update
    //users - delete
    //users - send messages
        //공통인데 어떻게 구현할지 생각해보자. 

    //providers - index
    route.get('/providers', (req,res)=>{
        res.render('1_members/providers_index');
    });
    //providers - search
    //providers - create
    //providers - show
    route.get('/providers/:id', (req,res)=>{
        res.render('1_members/providers_show');
    });
    //providers - edit
    route.get('/providers/:id', (req,res)=>{
        res.render('1_members/providers_edit');
    });
    //providers - update
    //providers - delete
    //providers - send messages

    //stores - index
    route.get('/stores', (req,res)=>{
        res.render('1_members/stores_index');
    });
    //stores - search
    //stores - show
    route.get('/stores/:id', (req,res)=>{
        res.render('1_members/stores_show');
    });
    //stores - edit
    route.get('/stores/:id', (req,res)=>{
        res.render('1_members/stores_edit');
    });
    //stores - update
    //stores - delete
    


    return route;
}