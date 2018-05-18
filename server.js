var app = require('./config/express.js')();
var passport = require('./config/passport.js')(app);
var db = require('./models/index');

app.use(function(req, res, next) {
    res.locals.user = req.user; // This is the important line
    console.log('res locals\n\n',res.locals);
    console.log('res locals user\n\n',res.locals.user);
    next();
});

var authRoutes = require('./app/routes/auth_routes')(passport);
app.use('/auth', authRoutes);
// var indexRoutes = require('./app/routes/index_routes');
// app.use('/',indexRoutes);

app.get('/', (req,res)=>{
    console.log(res.locals.user);
    res.render('index/home', {user:req.user});
})

app.get('/failure', (req,res)=>{
    res.send("Login failed");
})




db
.sequelize 
.sync()

app.listen(app.get('port'), ()=>{
    console.log('application on port '+ app.get('port'));
})


