const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');


var hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, './views/partials'),
    layoutsDir: './master/views/layouts'
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req,res)=>{
    res.send('index');
})

app.get('/index', (req,res)=>{
    res.render('index');
})

 
app.listen(4000, () => {
    console.log('Admin listening on port 4000');
});


module.exports = app;