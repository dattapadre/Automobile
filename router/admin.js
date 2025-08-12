var express = require('express')
const exe = require('../connection')
var router = express.Router()

router.get("/",function(req,res){
    res.render("admin/home.ejs")
})
router.get("/parts_inventory",function(req,res){
    res.render("admin/parts_inventory.ejs")
})
router.get("/vehicles", function (req,res){
    res.render("admin/vehicles.ejs")
});
router.post("/vehicles",async function(req,res){
    var d = req.body;
  var sql = `INSERT INTO vehicle_brand (vehicle_brand, vehicle_name) VALUES (?, ?)`;
  var result = await exe (sql,[d.vehicle_brand, d.vehicle_name]);
  

  // Execute SQL query with params
});

module.exports = router;