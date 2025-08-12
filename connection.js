var mysql = require('mysql')
var util = require('util')

var conn = mysql.createConnection({
    host:'brd7xt3smfitd45wjdv8-mysql.services.clever-cloud.com',
    user:'uzj8sjuu68qpenkc',
    password:'uzj8sjuu68qpenkc',
    database:'brd7xt3smfitd45wjdv8'
})

var exe = util.promisify(conn.query).bind(conn)
module.exports = exe;