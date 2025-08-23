var express =require('express')
var bodyparser =require('body-parser')
var upload = require('express-fileupload')
var session = require('express-session')
var admin_router = require('./router/admin')
var user_router = require('./router/user')
const cookieParser = require('cookie-parser');
var app =express()
app.use(express.static('public'));
app.use(cookieParser());

app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static('public/'))
app.use(upload())
app.use(session({
    secret:'qwertyi',
    resave:true,
    saveUninitialized:true
}))
app.use('/',user_router)
app.use('/admin',admin_router)

app.listen(1000)