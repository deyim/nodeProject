const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
const passport = require('../config/passport.js')(app);
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const db = require('../models/index');
const handlebarsHelpers = require('../lib/handlebars');

var hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, './views/partials'),
    layoutsDir: path.join(__dirname, './views/layouts'),
    helpers: handlebarsHelpers
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));
// app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, '/views/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

app.use(function(req,res,next){
    if(req.user){
        req.user.getProvider()
        .then(provider => {
            provider.getStore()
            .then(store=>{
                res.locals.store = store;
                next();
            })
        })
    } 
    else{
        next();
    }         
})

app.get('/', (req,res)=>{
    var errorMsg = null;
    if(res.locals.message.error!=undefined){
      errorMsg = res.locals.message.error[0];
    }
    req.session.message = [];
    res.render('index', {layout: false, message: errorMsg});
});


const dashboardRoutes = require('./routes/dashboard_routes')();
const authRoutes = require('./routes/auth_routes')(passport);
const membersRoutes = require('./routes/1_members_routes')();
const storesRoutes = require('./routes/2_stores_routes')();
const ordersRoutes = require('./routes/3_orders_routes')();
const salesRoutes = require('./routes/4_sales_routes')();
const sitesRoutes = require('./routes/5_sites_routes')();
const categoriesRoutes = require('./routes/6_categories_routes')();
app.use('/main',dashboardRoutes);
app.use('/auth', authRoutes);
app.use('/members', membersRoutes);
app.use('/stores', storesRoutes);
app.use('/orders', ordersRoutes);
app.use('/sales', salesRoutes);
app.use('/sites', sitesRoutes);
app.use('/categories', categoriesRoutes);
app.listen(4000, () => {
    console.log('Admin listening on port 4000');
});


module.exports = app;