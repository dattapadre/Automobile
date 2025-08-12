var mysql = require('mysql')
var util = require('util')

var conn = mysql.createConnection({
    host:'bn8txrkcfp43vajmsopo-mysql.services.clever-cloud.com',
    user:'urvn9rqiq1nki9wd',
    password:'urvn9rqiq1nki9wd',
    database:'bn8txrkcfp43vajmsopo'
})

var exe = util.promisify(conn.query).bind(conn)
module.exports = exe;