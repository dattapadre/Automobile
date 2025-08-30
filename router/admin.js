var express = require('express')
var exe = require('../connection')
var router = express.Router()

router.get("/", async function (req, res) {
   
    res.render("admin/login.ejs");
});


router.post("/login",async function(req,res){

   let d = req.body;
    let sql = `SELECT * FROM login WHERE admin_email='${d.admin_email}' AND   admin_password ='${d.admin_password}' `;
    let result = await exe(sql);



    if (result.length > 0) {
        // let logindata = result[0];
        req.session.admin_id = result[0].admin_id;
        console.log("login Success");
        return res.redirect("/admin/home");
    } else {
        console.log("Login Failed");
        return res.redirect("/admin");
    }


});

function authMiddleware(req, res, next) {
  if (req.session && req.session.admin_id) {
    next(); // session exists, continue
  } else {
    res.redirect("/admin"); // no session, redirect to login
  }
}
function noCache(req, res, next) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
}

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log("Error destroying session:", err);
      return res.send("Error logging out.");
    }

    res.redirect('/admin'); // or wherever you want to send after logout
  });
});
router.get("/home",authMiddleware,noCache, async function (req, res) {
    
    if (!req.session.admin_id) {
        return res.redirect("/admin");
    } else {
        var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);
        var sql = `SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`;
        var result = await exe(sql);
        var obj = { "admin": result[0], "user": user[0] };
        res.render("admin/home.ejs", obj);
    }
});
router.get("/customers" ,authMiddleware,noCache, async function (req, res) {
        var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);

    var Customer = await exe(`SELECT * FROM customers`);
    res.render("admin/customers.ejs", { Customer, "user": user[0] });
})
router.get("/parts_inventory",authMiddleware,noCache, async function (req, res) {
        var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);

    res.render("admin/parts_inventory.ejs", { "user": user[0] });
})
router.get("/vehicles", authMiddleware,noCache, async function (req, res) {
    var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);

    res.render("admin/vehicles.ejs", {  "user": user[0] });
});
router.get("/vehicle_list",authMiddleware,noCache, async function (req, res) {
    var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);
      var vehicle = await exe(`SELECT * FROM vehicle_brand`)
    var obj = { "vehicle": vehicle, "user": user[0] };
    res.render("admin/vehicle_list.ejs",obj)
});
router.post("/save_vehicle", async function (req, res) {
    var d = req.body;
    if (req.files) {
        var vehicle_image = new Date().getTime() + req.files.vehicle_image.name;
        req.files.vehicle_image.mv("public/categories/" + vehicle_image);

    }

    var sql = `INSERT INTO vehicle_brand (vehicle_image, vehicle_name) VALUES (?, ?)`;
    var result = await exe(sql, [vehicle_image, d.vehicle_name]);
    console.log(result);
    res.redirect("/admin/vehicles");

});

router.get("/delete_vehicle/:vehicle_id", async (req, res) => {
   
    var sql = `DELETE FROM vehicle_brand WHERE vehicle_id = ?`;
    var result = await exe(sql,[req.params.vehicle_id]);
    res.redirect("/admin/vehicle_list");
});
router.get("/edit_vehicle/:vehicle_id", async function (req, res) {
    var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);
    var sql = `SELECT * FROM vehicle_brand WHERE vehicle_id = ?`;
    var result = await exe(sql, [req.params.vehicle_id]);
    res.render("admin/edit_vehicle.ejs", { vehicle: result[0], "user": user[0] });
});

router.post("/update_vehicle", async function (req, res) {
    var d = req.body;
    var vehicle_image = d.old_image || "";

    if (req.files && req.files.vehicle_image) {
        vehicle_image = new Date().getTime() + req.files.vehicle_image.name;
        req.files.vehicle_image.mv('public/categories/' + vehicle_image);
    }

    var sql = `UPDATE vehicle_brand SET vehicle_image = ?, vehicle_name = ? WHERE vehicle_id = ?`;
    var result = await exe(sql, [vehicle_image, d.vehicle_name, d.vehicle_id]);
    console.log(result);

    res.redirect("/admin/vehicle_list");
});
router.get("/add_product", authMiddleware,noCache, async function (req, res) {
    var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);
    var vehicle = await exe(`SELECT * FROM vehicle_brand`)
    res.render('admin/add_product.ejs', { vehicle,"user": user[0] });
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
router.get("/all_parts", authMiddleware,noCache, async function (req, res) {
   let page = parseInt(req.query.page) || 1; // Default page 1
    let limit = 10; // एका पेजवर किती items दाखवायचे
    let offset = (page - 1) * limit;

    // Total count काढण्यासाठी
    let totalRows = await exe(`SELECT COUNT(*) AS count FROM products`);
    let totalPages = Math.ceil(totalRows[0].count / limit);

    // Pagination सह query
    var result = await exe(`SELECT * FROM products LIMIT ${limit} OFFSET ${offset}`);
    var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);

    res.render("admin/product_list.ejs", {
        result,
        currentPage: page,
        totalPages,
       "user": user[0]
    });
});
router.get('/edit_product/:id',async function(req,res){
    var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);
    var sql =`SELECT * FROM products WHERE product_id ='${req.params.id}'`;
    var result = await exe(sql)
    var vehicle = await exe(`SELECT * FROM vehicle_brand`)
    res.render("admin/edit_product.ejs",{result,vehicle,"user": user[0]})
});

router.post("/update_product",async function (req,res) {
   var d = req.body;
console.log(d);
console.log(req.files);

var filename = d.old_image || "";   
var filename1 = d.old_image1 || "";
var filename2 = d.old_image2 || "";

// Main Image
if (req.files && req.files.product_image) {
    filename = new Date().getTime() + req.files.product_image.name;
    req.files.product_image.mv('public/product/' + filename);
}

// Image 1
if (req.files && req.files.product_image1) {
    filename1 = new Date().getTime() + req.files.product_image1.name;
    req.files.product_image1.mv('public/product/' + filename1);
}

// Image 2
if (req.files && req.files.product_image2) {
    filename2 = new Date().getTime() + req.files.product_image2.name;
    req.files.product_image2.mv('public/product/' + filename2);
}


var sql = `
    UPDATE products SET
        product_name = ?,
        product_image = ?,
        product_image1 = ?,
        product_image2 = ?,
        product_price = ?,
        product_market_price = ?,
        product_part_type = ?,
        product_sub_part = ?,
        product_vehicle_type_id = ?,
        product_availability = ?,
        product_trending = ?,
        product_added_date = ?,
        product_description = ?
    WHERE product_id = ?
`;

var result = await exe(sql, [
    d.product_name,
    filename,
    filename1,
    filename2,
    d.product_price,
    d.product_market_price,
    d.product_part_type,
    d.product_sub_part,
    d.product_vehicle_type_id,
    d.product_availability,
    d.product_trending,
    d.product_added_date,
    d.product_description,
    d.product_id  
]);

console.log(result);
res.redirect("/admin/all_parts");

});
router.get("/delete_product/:product_id", async (req, res) => {
    var id = req.params.product_id;
    var sql = `DELETE FROM products WHERE product_id = ?`;
    await exe(sql, [id]);
    res.redirect("/admin/all_parts");
});

router.get("/slider",authMiddleware,noCache, async function(req,res){
    var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);
      var sql = `SELECT * FROM slider`;
    var data = await exe(sql);
    var obj = { "data": data, "user": user[0] }
    res.render("admin/slider.ejs", obj)
})
router.post("/save_slider", async function (req, res) {
    var d = req.body;
    if (req.files) {
        var slider_image = new Date().getTime() + req.files.slider_image.name;
        req.files.slider_image.mv("public/home/" + slider_image);
    }

    var sql = `INSERT INTO slider (Slider_title, slider_description, slider_image) VALUES (?, ?, ?)`;
    var data = await exe(sql, [d.Slider_title, d.slider_description, slider_image]);
    console.log(data);
    res.redirect("/admin/slider");
});
router.get("/delete/:id", async (req, res) => {
  var id= req.params.id;
  var sql = `DELETE FROM slider WHERE id = ?`;
  await exe(sql,[id]);
  res.redirect("/admin/slider");
});
router.get("/edit_slider/:id", async function(req, res) {
    var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);
    var id = req.params.id;
    var sql = `SELECT * FROM slider WHERE id = ?`;
    var data = await exe(sql, [id]);
    res.render("admin/edit_slider.ejs", { slider: data[0], "user": user[0] });
});
router.post("/update_slider", async function (req, res) {
      var d = req.body;

    if (req.files && req.files.slider_image) {
       var slider_image = new Date().getTime() + req.files.slider_image.name;
       req.files.slider_image.mv("public/home/" + slider_image);
    }

    var sql = `UPDATE slider SET Slider_title= ?, slider_description= ?, slider_image= ? WHERE id= ?`;
    await exe(sql, [d.Slider_title, d.slider_description, slider_image, d.id]);

    res.redirect("/admin/slider");
});
router.get("/category", authMiddleware,noCache, async function(req,res){
    var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);
    var sql = `SELECT * FROM category`;
    var category = await exe(sql);
    var obj = { "category": category, "user": user[0] }
    res.render("admin/category.ejs", obj);
});
router.post("/save_category", async function (req, res) {
    var d = req.body;
    if (req.files) {
        var filename = new Date().getTime() + req.files.image.name;
        req.files.image.mv("public/home/" + filename);
    }

    var sql = `INSERT INTO category (title, image) VALUES (?, ?)`;
    var data = await exe(sql, [d.title, filename]);
    console.log(data);
    res.redirect("/admin/category");
});
router.get("/delete_category/:id", async (req, res) => {
  var id= req.params.id;
  var sql = `DELETE FROM category WHERE id = ?`;
  await exe(sql,[id]);
  res.redirect("/admin/category");
});
router.get("/edit_category/:id", async function(req, res) {
    var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);
    var id = req.params.id;

    try {
        var data = await exe(`SELECT * FROM category WHERE id = '${id}'`);
        var obj = { list: data  };
        res.render("admin/edit_category.ejs",{category:data[0],"user": user[0]});
    } catch (err) {
        console.log("Error:", err);
        res.status(500).send("Database error");
    }
});
router.post("/update_category", async function (req, res) {
   var d= req.body;
   var filename ="";
   if(req.files){
    var filename = new Date().getTime() + req.files.image.name;
    req.files.image.mv("public/home/" + filename);
   }
   var sql = `UPDATE category SET title='${d.title}', image='${filename}' WHERE id='${d.id}'`;
   var result = await exe(sql);
   res.redirect("/admin/category");
});
router.get('/pending_order',authMiddleware,noCache, async function(req,res){
    var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);
    var sql =` SELECT * FROM orders`
    var result = await exe(sql)
    res.render('admin/pending_order.ejs',{result, "user": user[0]})
})
router.get('/order_details/:id',authMiddleware,noCache, async function(req,res){
    var user = await exe(`SELECT * FROM login WHERE admin_id='${req.session.admin_id}'`);
    var sql = `SELECT * FROM orders WHERE order_id = '${req.params.id}'`
    var order = await exe(sql) 
    var sql2 = `SELECT * FROM order_products WHERE order_id = '${req.params.id}'`
    var products = await exe(sql2)
    console.log(products, order)
    res.render('admin/order_details.ejs',{order,products,user: user[0]})
});
router.get("/profile",authMiddleware,noCache, async function (req, res) {
   const result = await exe(`SELECT * FROM login WHERE admin_id = '${req.session.admin_id}'`);
    res.render("admin/profile.ejs", { admin: result[0], "user": result[0] });
});
router.post("/save_profile", async (req, res) => {
  let d = req.body;

  if (req.files && req.files.admin_image) {
        var admin_image = new Date().getTime()+req.files.admin_image.name;
        req.files.admin_image.mv("public/upload/"+admin_image);
        var sql = `UPDATE login SET admin_image = '${admin_image}'WHERE admin_id = '${d.admin_id}'`
        var data = await exe(sql);
    }

   
    var sql = ` UPDATE login SET
        admin_name = ?,  admin_mobile = ?, admin_email = ?,
        admin_password = ?
      WHERE admin_id = '${d.admin_id}'`;
    var data = await exe(sql,[ d.admin_name, d.admin_mobile, d.admin_email, d.admin_password]);
//   res.send(data)
  res.redirect("/admin/profile")
});

module.exports = router;