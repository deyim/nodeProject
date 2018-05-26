module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const db = require('../../models/index');

    route.get('/', (req,res)=>{
        db.User.findById(1)
        .then(user=>{
            user.updateAttributes({
                providerChk:true,
                masterChk:true
            })
        })
        res.redirect('/');
    });

    return route;
}