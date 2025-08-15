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
router.get("/add_product", async function (req, res) {
    var vehicle = await exe(`SELECT * FROM vehicle_brand`)
    res.render('admin/add_product.ejs', { vehicle })
})
router.post("/save_product", async function (req, res) {
    var d = req.body
    console.log(d)
    console.log(req.files)
    var filename = ""
    var filename1 = ""
    var filename2 = ""
    if (req.files && req.files.product_image) {
        var filename = new Date().getTime() + req.files.product_image.name;
        req.files.product_image.mv('public/product/' + filename)
    }
    if (req.files && req.files.product_image1) {
        var filename1 = new Date().getTime() + req.files.product_image1.name;
        req.files.product_image.mv('public/product/' + filename1)
    }
    if (req.files && req.files.product_image2) {
        var filename2 = new Date().getTime() + req.files.product_image2.name;
        req.files.product_image.mv('public/product/' + filename2)
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
    var result = await exe(sql, [d.product_name, filename, filename1, filename2, d.product_price, d.product_market_price, d.product_part_type, d.product_sub_part, d.product_vehicle_type_id, d.product_availability, d.product_trending, d.product_added_date, d.product_description])
    console.log(result)

    res.redirect("/admin/add_product")
})
router.get("/slider", async function (req, res) {
    var sql = `SELECT * FROM slider`;
    var data = await exe(sql);
    var obj = { "list": data }
    res.render("admin/slider.ejs", { data })
})
router.post("/slider", async function (req, res) {
    var d = req.body;
    if (req.files) {
        var filename = new Date().getTime() + req.files.image.name;
        req.files.image.mv("public/home/" + filename);

    }

    var sql = `INSERT INTO slider (name,image, description) VALUES (?,?, ?);`
    var data = await exe(sql, [d.title, filename, d.description]);
    console.log(data);
    res.redirect("/admin/slider");
});
router.get("/slider/:id", async (req, res) => {
  var id= req.params.id;
  var sql = `DELETE  FROM slider WHERE id = ?`;
  var data  = await exe(sql,[id]);
  // res.send("delete successfull")
  res.redirect("/admin/slider");
});

router.get("/edit_slider/:id", async function(req, res) {
    var id = req.params.id;

    try {
        var data = await exe(`SELECT * FROM slider WHERE id = '${id}'`);
        var obj = { list: data };
        res.render("admin/edit_slider.ejs", obj);
    } catch (err) {
        console.log("Error:", err);
        res.status(500).send("Database error");
    }
});
router.post("/edit_slider/:id", async function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var description = req.body.description;
    var imageName = req.body.old_image; 

    if (req.files && req.files.image) {
        var newName = Date.now() + "_" + req.files.image.name;
        req.files.image.mv("public/home/" + newName);
        imageName = newName;
    }

    var sql = `UPDATE slider SET name='${name}', description='${description}', image='${imageName}' WHERE id='${id}'`;
    await exe(sql);

    res.redirect("/admin/slider");
});


module.exports = router;