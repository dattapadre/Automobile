var express =  require('express')
var bodyparser = require('body-parser')
var session = require('express-session')
var upload = require('express-fileupload')
var bodyparser = require('body-parser')
var admin_route = require('./routes/admin')
var user_route = require('./routes/user')
var app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(upload())
app.use(express.static('public/'))
app.use(session({
    secret:'qwertyi',
    resave:false,
    saveUninitialized:true
}))
app.use('/',user_route)
app.use('/admin',admin_route)

app.listen(1000)

