var db = require('../models/index');
var bodyParser = require('body-parser');

exports.sendMessages = function(req,res){
    res.redirect('/members/users')
}