module.exports = ()=>{
    const express = require('express');
    const session = require('express-session');
    const SequelizeStore = require('connect-session-sequelize')(session.Store);
    const exphbs = require('express-handlebars');
    const bodyParser = require('body-parser');
    const flash = require('connect-flash');
    const path = require('path');
    var db = require('../models/index');
    var app = express();

    
    //views
    var hbs = exphbs.create({
        defaultLayout: 'main',
        partialsDir: path.join(__dirname, '../app/views/partials'),
        layoutsDir: path.join(__dirname, '../app/views/layouts')
    });
    // app.use('../public', express.static(path.join(__dirname,'../public')));
    app.use(express.static('public'));
    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, '../app/views'));
    // app.set('views', path.join(__dirname,'../app/views'));


    app.use(session({ 
        secret: "sosohang",
        store: new SequelizeStore({
            db: db.sequelize,
            checkExpirationInterval: 15 * 60 * 1000,
            expiration: 24 * 60 * 60 * 1000
        }),
        resave: false,
        saveUninitialized: true
     }));
    app.set('port', process.env.PORT||3000);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(flash());
    
    return app;
}