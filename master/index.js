const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
const passport = require('../config/passport.js')(app);
const bodyParser = require('body-parser');

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

app.get('/', (req,res)=>{
    res.render('index', {layout: false, error:req.session.error});
});
// app.get('/main', (req,res)=>{
//     res.render('main');
// });
const authRoutes = require('./routes/auth_routes')(passport);
const membersRoutes = require('./routes/1_members_routes')();
const approvalsRoutes = require('./routes/2_approvals_routes')();
const storesRoutes = require('./routes/3_stores_routes')();
const ordersRoutes = require('./routes/4_orders_routes')();
const salesRoutes = require('./routes/5_sales_routes')();
const managersRoutes = require('./routes/6_managers_routes')();
const codesRoutes = require('./routes/7_codes_routes')();
const categoriesRoutes = require('./routes/8_categories_routes')();
const contentsRoutes = require('./routes/9_contents_routes')();
const countsRoutes = require('./routes/10_counts_routes')();
app.use('/auth', authRoutes);
app.use('/members', membersRoutes);
app.use('/approvals', approvalsRoutes);
app.use('/stores', storesRoutes);
app.use('/orders', ordersRoutes);
app.use('/sales', salesRoutes);
app.use('/managers', managersRoutes);
app.use('/codes', codesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/contents', contentsRoutes);
app.use('/counts', countsRoutes);
 
app.listen(4020, () => {
    console.log('Master listening on port 4020');
});


module.exports = app;