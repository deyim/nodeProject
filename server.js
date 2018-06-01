const vhost = require('vhost');
var app = require('./config/express.js')();
const passport = require('./config/passport.js')(app);
const db = require('./models/index');

const master = require('./master/index.js');
const admin = require('./admin/index.js');

db
.sequelize 
.sync()

app.use(function(req, res, next) {
    res.locals.user = req.user; // This is the important line
    res.locals.message = req.session.message || {};
    next();
});
app.use(vhost('master.sosohang.com',master));
app.use(vhost('admin.sosohang.com', admin));

var authRoutes = require('./app/routes/auth_routes')(passport);
app.use('/auth', authRoutes);

app.get('/', (req,res)=>{
    res.render('index/home');
})

app.get('/dbcreate', (req,res,next)=>{
    console.log('\n\n','dbcreate');
    provider = db.Provider.create({
        companyName: 'admin2store',
        companyNumber: '42132',
        companyType: 'A',
        CEO: 'agsdf',
        CEONumber: 'aas',
        staffName: 'aas',
        staffNumber: 'aas',
        accountNumber: 'aas',
        accountName: 'aas',
        accountBank: 'aas',
        rateType: 'a',
    })
    .then(provider=>{
        console.log('222222');
        req.provider = provider;
        next();
    })
}, (req,res)=>{
    console.log('3333333');
    db.User.findById(8)
    .then(user=>{
        user.update({providerChk:true});
        req.provider.setUser(user);
        res.redirect('/');
    })
    
});

app.get('/failure', (req,res)=>{
    res.send("Login failed");
})



app.listen(app.get('port'), ()=>{
    console.log('application on port '+ app.get('port'));
})


