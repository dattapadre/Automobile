var express = require('express')
var router = express.Router()

router.get("/",function(req,res){
    res.render("admin/home.ejs")
});
router.get("/vehicles", function (req,res){
    res.render("admin/vehicles.ejs")
});

module.exports = router;