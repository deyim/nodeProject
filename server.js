var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes');
var app = express();
var user =  require('./routes/user');
var db = require('./models/index');
var http = require('http');
var passport = require('passport');
var passportConfig = require('./config/passport');
var home = require('./routes/home');
var application = require('./routes/application');
const exphbs = require('express3-handlebars');

SALT_WORK_FACTOR = 12;
var hbs = exphbs.create({
    // defaultLayout: 'main',
    partialsDir: 'app/views/partials',
    layoutsDir:'app/views/layouts'
})

app.use('/public', express.static(__dirname+'/public'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname+'/views');
app.set('port', process.env.PORT||3000);

app.use(session({ 
    secret: "cats",
    resave: false,
    saveUninitialized: true
 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', routes.index);
// app.get('/home', application.IsAuthenticated);
app.get('/home', function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        next(new Error(401));
    }
});
app.get('/home', home.homepage);
app.post('/authenticate', 
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/'
    })
);
app.get('/logout', application.destroySession);
app.get('/signup', user.signUp);
app.post('/register', user.register);
app.get('/hihi', (req,res)=>{
    res.render('hihi', {user:req.user});
})
app.get('/kakao', passport.authenticate('kakao'));
app.get('/oauth/kakao', 
    passport.authenticate('kakao',{
        successRedirect : '/home',
        failureRedirect : '/'
    })
);

db
.sequelize 
.sync()

app.listen(app.get('port'), ()=>{
    console.log('application on port '+ app.get('port'));
})


