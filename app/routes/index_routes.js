module.exports =() => {
    var express = require('express');
    var route = express.Router();
    const db = require('../../models/index');

    route.get('/', (req,res)=>{
        console.log("render index home page!!!")
        res.render('index/home');
    })

          
    return route;
}