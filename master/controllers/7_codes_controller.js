const db = require('../../models/index');
const bodyParser = require('body-parser');
const Op = db.Sequelize.Op

module.exports = ()=>{
    productcodesIndex: (req,res)=>{

    }

    productcodesAdd: (req,res)=>{

    }

    productcodesGenerate: (req,res)=>{
        var numbers = req.quer.number;
        db.Productcode.createbulk()
    }

    ordercodesIndex: (req,res)=>{

    }

    ordercodesAdd: (req,res)=>{
        
    }

    ordercodesGenerate: (req,res)=>{
        var numbers = req.quer.number;
        db.Ordercode.createbulk()
    }

    noticecodesIndex: (req,res)=>{

    }

    noticecodesAdd: (req,res)=>{
        
    }

    noticecodesGenerate: (req,res)=>{
       db.Noticecode.create({})
       .then(noticecode=>{
           
       })
    }



    return route;
}