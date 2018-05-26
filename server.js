const vhost = require('vhost');
var app = require('./config/express.js')();
const passport = require('./config/passport.js')(app);
const db = require('./models/index');

const master = require('./master/index.js');
const admin = require('./admin/index.js');

app.use(function(req, res, next) {
    res.locals.user = req.user; // This is the important line
    next();
});
app.use(vhost('master.sosohang.com',master));
app.use(vhost('admin.sosohang.com', admin));

var authRoutes = require('./app/routes/auth_routes')(passport);
app.use('/auth', authRoutes);

app.get('/', (req,res)=>{
    res.render('index/home');
})
// app.get('/', (req,res)=>{
//     console.log(res.locals.user);
//     res.render('index/home', {user:req.user});
// })

app.get('/failure', (req,res)=>{
    res.send("Login failed");
})

db
.sequelize 
.sync()

app.listen(app.get('port'), ()=>{
    console.log('application on port '+ app.get('port'));
})


