module.exports = ()=>{
    const express = require('express');
    const route = express.Router();

    route.get('/', (req,res)=>{
        res.send('ADMIN');
    });

    return route;
}