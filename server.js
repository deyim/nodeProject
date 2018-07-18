const vhost = require('vhost');
var app = require('./config/express.js')();
const passport = require('./config/passport.js')(app);
const db = require('./models/index');


db
.sequelize 
.sync()

//user variable on every page
app.use(function(req, res, next) {
    res.locals.user = req.user; // This is the important line
    res.locals.message = req.session.message || {};
    next();
});

//subdomain master and partner(admin)
//master.sosohang.com -> start from /master/index.js 
//partner.sosohang.com -> start from /adimn/index.js
const master = require('./master/index.js');
const admin = require('./admin/index.js');
app.use(vhost('master.sosohang.com',master));
app.use(vhost('partner.sosohang.com', admin));

//user app login pages -> should move after user page setup
var authRoutes = require('./app/routes/auth_routes')(passport);
app.use('/auth', authRoutes);
app.get('/', (req,res)=>{
    res.render('index/home');
});
app.get('/failure', (req,res)=>{
    res.send("Login failed");
});



app.listen(app.get('port'), ()=>{
    console.log('application on port '+ app.get('port'));
})


