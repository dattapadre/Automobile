var express = require('express')
const exe = require('../connection')
var router = express.Router()

router.get("/", function (req, res) {
    res.render("admin/home.ejs")
})
router.get("/parts_inventory", function (req, res) {
    res.render("admin/parts_inventory.ejs")
})
router.get("/vehicles", function (req, res) {
    res.render("admin/vehicles.ejs")
});
router.post("/vehicles", async function (req, res) {
    var d = req.body;
    if (req.files) {
        var vehicle_brand = new Date().getTime() + req.files.vehicle_brand.name;
        req.files.vehicle_brand.mv("public/categories/" + vehicle_brand);

    }

    var sql = `INSERT INTO vehicle_brand (vehicle_brand, vehicle_name) VALUES (?, ?)`;
    var result = await exe(sql, [vehicle_brand, d.vehicle_name]);
    console.log(result);
    res.redirect("/admin/vehicles");

    // Execute SQL query with params
});
router.get("/add_product",async function (req, res) {
    var vehicle =await exe(`SELECT * FROM vehicle_brand`)
    res.render('admin/add_product.ejs',{vehicle})
})
router.post("/save_product",async function (req, res) {
    var d = req.body
    console.log(d)
    console.log(req.files)
    var filename = ""
    var filename1 = ""
    var filename2 = ""
    if (req.files && req.files.product_image) {
        var filename = new Date().getTime() + req.files.product_image.name;
        req.files.product_image.mv('public/upload/' + filename)
    }
    if (req.files && req.files.product_image1) {
        var filename1 = new Date().getTime() + req.files.product_image1.name;
        req.files.product_image.mv('public/upload/' + filename1)
    }
    if (req.files && req.files.product_image2) {
        var filename2 = new Date().getTime() + req.files.product_image2.name;
        req.files.product_image.mv('public/upload/' + filename2)
    }
    var sql = `INSERT INTO products (
            product_name,
            product_image,
            product_image1,
            product_image2,
            product_price,
            product_market_price,
            product_part_type,
            product_sub_part,
            product_vehicle_type_id,
            product_availability,
            product_trending,
            product_added_date,
            product_description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    var result =await exe(sql,[d.product_name,filename,filename1,filename2,d.product_price,d.product_market_price,d.product_part_type,d.product_sub_part,d.product_vehicle_type_id,d.product_availability,d.product_trending,d.product_added_date,d.product_description])
    console.log(result)

    res.redirect("/admin/add_product")
})

module.exports = router;