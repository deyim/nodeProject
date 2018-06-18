const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
const passport = require('../config/passport.js')(app);
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const db = require('../models/index');

var hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, './views/partials'),
    layoutsDir: path.join(__dirname, './views/layouts'),
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/views/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

app.use(function(req,res,next){
    db.Store.find({
        include: [
            {
                model: db.Provider,
                as: 'provider',
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        where: {
                            id: req.user.id
                        }
                    }
                ]
            }
        ]
    }).then(store=>{        
        res.locals.store = store;
        next();
    })    
})

app.get('/', (req,res)=>{
    var errorMsg = null;
    if(res.locals.message.error!=undefined){
      errorMsg = res.locals.message.error[0];
    }
    req.session.message = [];
    res.render('index', {layout: false, message: errorMsg});
});

app.get('/main', (req,res)=>{
    res.render('dashboard');
});

const authRoutes = require('./routes/auth_routes')(passport);
const membersRoutes = require('./routes/1_members_routes')();
// const storesRoutes = require('./routes/3_stores_routes')();
// const ordersRoutes = require('./routes/4_orders_routes')();
// const salesRoutes = require('./routes/5_sales_routes')();
// const categoriesRoutes = require('./routes/8_categories_routes')();
app.use('/auth', authRoutes);
app.use('/members', membersRoutes);
// app.use('/stores', storesRoutes);
// app.use('/orders', ordersRoutes);
// app.use('/sales', salesRoutes);
// app.use('/categories', categoriesRoutes);
app.listen(4000, () => {
    console.log('Admin listening on port 4000');
});


module.exports = app;