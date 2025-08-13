var mysql = require('mysql')
var util = require('util')

var conn = mysql.createConnection({
    host:'bn8txrkcfp43vajmsopo-mysql.services.clever-cloud.com',
    user:'urvn9rqiq1nki9wd',
    password:'Ok1r4B4ZIxJouZ5dpLKy',
    database:'bn8txrkcfp43vajmsopo'
})

var exe = util.promisify(conn.query).bind(conn)
module.exports = exe;