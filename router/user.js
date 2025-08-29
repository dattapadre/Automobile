var express = require('express')
var router = express.Router()
var url = require('url')
var exe = require('../connection')


router.use(async (req, res, next) => {
    let count = 0;

    if (req.session.user_id) {
        const customer_id = req.session.user_id;
        const sql = `SELECT SUM(quantity) as total FROM cart WHERE customer_id = ?`;
        const result = await exe(sql, [customer_id]);
        count = result[0].total || 0;
    } else {
        let carts = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
        // cookie मध्ये qty property असेल तर त्याचा sum घे
        count = carts.reduce((acc, item) => acc + (parseInt(item.qty) || 1), 0);
    }
    var categories = await exe(`SELECT * FROM vehicle_brand`);
    res.locals.categories = categories;

    res.locals.cartCount = count;
    res.locals.is_login = req.session.user_id ? true : false;
      // सर्व templates मध्ये available होईल
    next();
});
router.get("/search_products/:text", async function (req, res) {
    try {
        let text = req.params.text;
        let sql = `SELECT product_name,product_id FROM products WHERE product_name LIKE ? LIMIT 10`;
        let result = await exe(sql, [`%${text}%`]);

        res.json(result); // suggestions परत करायच्या
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }

});

router.get("/product_list/:id", async function (req, res) {

    let id = req.params.id;
    let products = await exe(`SELECT * FROM products WHERE product_id = '${id}'`);

    // let sql2 = ``;
    let result = await exe(`SELECT * FROM products WHERE product_sub_part = '${products[0].product_sub_part}' `)
    // res.send(result);
    let categories = await exe(`SELECT * FROM vehicle_brand`);
    let is_login = req.session.user_id ? true : false;
    // var data = `${products}`

    res.render("user/product_details.ejs", { result, categories, is_login });
});

router.get("/like/:product_id", async (req, res) => {
    const productId = req.params.product_id;
    const redirectUrl = req.query.redirect || "/"; // default root if not sent

    try {
        await exe("UPDATE products SET like_wish='like' WHERE product_id=?", [productId]);
        res.redirect(redirectUrl); // user current page वर redirect
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

router.get("/dislike/:product_id", async (req, res) => {
    const productId = req.params.product_id;
    const redirectUrl = req.query.redirect || "/";

    try {
        await exe("UPDATE products SET like_wish='deslike' WHERE product_id=?", [productId]);
        res.redirect(redirectUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});


router.get("/wish_list", async function (req, res) {
    var data = await exe(`SELECT * FROM products WHERE like_wish='like'`);
    res.send(data);
})




router.get("/", async function (req, res) {

    var vehicle = await exe(`SELECT * FROM vehicle_brand`);


    var data = await exe(`SELECT * FROM slider`);

    var result = await exe(`SELECT * FROM category`);

    var product = await exe(`SELECT * FROM products  LIMIT 4`);

    var products = await exe(`SELECT * FROM products ORDER BY product_id DESC LIMIT 6`);

    var interior = await exe(`SELECT * FROM products WHERE product_part_type = 'Interior' LIMIT 4`);

    var exterior = await exe(`SELECT * FROM products WHERE product_part_type = 'bodypart' LIMIT 4`);

    var performance = await exe(`SELECT * FROM products WHERE product_part_type = 'Engine' LIMIT 4`);


    var obj = { "data": data, "result": result, "product": product, "products": products, "interior": interior, "exterior": exterior, "performance": performance, "vehicle": vehicle, };
    res.render("user/home.ejs", obj);
})
router.get('/body-parts', async function (req, res) {
    var data = url.parse(req.url, true).query;
    let sql = "";
    if (data.cat) {
        if (data.cat == 'front_bumper') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Front Bumper'`;
        }
        else if (data.cat == 'rear_bumper') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Rear Bumper'`;
        }
        else if (data.cat == 'side_mirror') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Side Mirror'`;
        }
        else if (data.cat == 'accessories') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Accessories'`;
        }
        else if (data.cat == 'maintenance') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Maintenance Body Parts'`;
        }
        else {
            sql = `SELECT * FROM products WHERE product_part_type = bodypart`;
        }
    } else {
        sql = `SELECT * FROM products WHERE product_part_type = 'bodypart'`;
    }
    var result = await exe(sql);
    var categories = await exe(`SELECT * FROM vehicle_brand`)
    var is_login = (req.session.user_id) ? true : false;
    var data = 'Body Parts'
    res.render('user/product_details.ejs', { result, categories, is_login ,data})
});
router.get('/interior', async function (req, res) {
    var data = url.parse(req.url, true).query;
    let sql = "";
    if (data.cat) {
        if (data.cat == 'Seats') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Seats'`;
        }
        else if (data.cat == 'Dashboard') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Dashboard'`;
        }
        else if (data.cat == 'Ac_Vents') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Ac Vents'`;
        }
        else if (data.cat == 'Air_Bag') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Air Bag Covers'`;
        }
        else if (data.cat == 'Seat') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Seat Pockets'`;
        }
        else if (data.cat == 'Handle_Set') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Handle Set'`;
        }
        else {
            sql = `SELECT * FROM products WHERE product_part_type = 'Interior'`;
        }
    } else {
        sql = `SELECT * FROM products WHERE product_part_type = 'Interior'`;
    }
    var result = await exe(sql);
    var categories = await exe(`SELECT * FROM vehicle_brand`)
    var is_login = (req.session.user_id) ? true : false;
    var data = 'Interior Parts'
    res.render('user/product_details.ejs', { result, categories, is_login,data})

});
router.get('/Suspension', async function (req, res) {
    var data = url.parse(req.url, true).query;
    let sql = "";
    if (data.cat) {
        if (data.cat == 'Front_Wheel') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Front Wheel Suspension'`;
        }
        else if (data.cat == 'Rear_Wheel') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Rear Wheel Suspension'`;
        }
        else if (data.cat == 'Shockers') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'All Shockers Parts'`;
        }
        else {
            sql = `SELECT * FROM products WHERE product_part_type = "Suspension"`;
        }
    } else {
        sql = `SELECT * FROM products WHERE product_part_type = "Suspension"`;
    }
    var result = await exe(sql);
    var categories = await exe(`SELECT * FROM vehicle_brand`)
    var is_login = (req.session.user_id) ? true : false;
    var data = 'Suspension'
    res.render('user/product_details.ejs', { result, categories, is_login ,data})

});
router.get('/Air_Suspension', async function (req, res) {
    var data = url.parse(req.url, true).query;
    let sql = "";
    if (data.cat) {
        if (data.cat == 'AirMatic') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Air Matic Shockers'`;
        }
        else if (data.cat == 'Electric_shoc') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Electric Shockers'`;
        }
        else if (data.cat == 'Air_compressors') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Air Compressors'`;
        }
        else if (data.cat == 'Valve') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Valve Blockers'`;
        }
        else if (data.cat == 'Air_repair_kit') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Air Compressor Repair Kit'`;
        }
        else if (data.cat == 'Air_balloons') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Air Balloons'`;
        }
        else {
            sql = `SELECT * FROM products WHERE product_part_type = 'Air'`;
        }
    } else {
        sql = `SELECT * FROM products WHERE product_part_type = 'Air'`;
    }
    var result = await exe(sql);
    var categories = await exe(`SELECT * FROM vehicle_brand`)
    var is_login = (req.session.user_id) ? true : false;
    var data = 'Air_Suspension '
    res.render('user/product_details.ejs', { result, categories, is_login,data })

});
router.get('/Electric_partd', async function (req, res) {
    var data = url.parse(req.url, true).query;
    let sql = "";
    if (data.cat) {
        if (data.cat == 'Fuel_pump') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Fuel Pumps'`;
        }
        else if (data.cat == 'Fuel_lidmotor') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Fuel Lid Motors'`;
        }
        else if (data.cat == 'Fuel_relay') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Fuel Relays'`;
        }
        else if (data.cat == 'ignition_coil') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Ignition Coil'`;
        }
        else if (data.cat == 'spark') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Spark Plugs'`;
        }
        else if (data.cat == 'door_latchs') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Door Latchs'`;
        }
        else if (data.cat == 'glass_machines') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Glass Machines'`;
        }
        else if (data.cat == 'Fan_relays') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Fan Relays'`;
        }
        else {
            sql = `SELECT * FROM products WHERE product_part_type = 'Electric'`;
        }
    } else {
        sql = `SELECT * FROM products WHERE product_part_type = 'Electric'`;
    }
    var result = await exe(sql);
    var categories = await exe(`SELECT * FROM vehicle_brand`)
    var data = 'Electric Parts '
    var is_login = (req.session.user_id) ? true : false;

    res.render('user/product_details.ejs', { result, categories, is_login ,data})

});
router.get('/Engine', async function (req, res) {
    var data = url.parse(req.url, true).query;
    let sql = "";
    if (data.cat) {
        if (data.cat == 'engine_suspension') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Engine Suspension'`;
        }
        else if (data.cat == 'timing_parts') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Timing Parts'`;
        }
        else if (data.cat == 'engine_components') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Engine Components'`;
        }
        else {
            sql = `SELECT * FROM products WHERE product_part_type = 'Engine'`;
        }
    } else {
        sql = `SELECT * FROM products WHERE product_part_type = 'Engine'`;
    }
    var result = await exe(sql);
    var categories = await exe(`SELECT * FROM vehicle_brand`)
    var is_login = (req.session.user_id) ? true : false;
    var data = 'Engine '
    res.render('user/product_details.ejs', { result, categories, is_login ,data})

});
router.get('/sensors', async function (req, res) {
    var data = url.parse(req.url, true).query;
    let sql = "";
    if (data.cat) {
        if (data.cat == 'abs_sensors') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'ABS Sensors'`;
        }
        else if (data.cat == 'air_mask_sensors') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Air Mask Sensors'`;
        }
        else if (data.cat == 'level_sensors') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Level Sensors'`;
        }
        else if (data.cat == 'tempeature_sensors') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Temperature Sensors'`;
        }
        else if (data.cat == 'cam_sensors') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Cam Sensors'`;
        }
        else if (data.cat == 'break_pad_sensors') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Break Pad Sensors'`;
        }
        else if (data.cat == 'tire_pressure_sensors') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Tire Pressure Sensor'`;
        }
        else if (data.cat == 'packing_sensors') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Packing Sensors'`;
        }
        else {
            sql = `SELECT * FROM products WHERE product_part_type = 'Sensors'`;
        }
    } else {
        sql = `SELECT * FROM products WHERE product_part_type = 'Sensors'`;
    }
    var result = await exe(sql);
    var categories = await exe(`SELECT * FROM vehicle_brand`)
    var is_login = (req.session.user_id) ? true : false;
    var data = 'Sensors '
    res.render('user/product_details.ejs', { result, categories, is_login ,data})

});
router.get('/brake', async function (req, res) {
    var data = url.parse(req.url, true).query;
    let sql = "";
    if (data.cat) {
        if (data.cat == 'front_brakes') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Front Brakes'`;
        }
        else if (data.cat == 'rear_brakes') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Rear Brakes'`;
        }
        else if (data.cat == 'brake_caplipers') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Brake Calipers'`;
        }
        else {
            sql = `SELECT * FROM products WHERE product_part_type = 'Brake'`;
        }
    } else {
        sql = `SELECT * FROM products WHERE product_part_type = 'Brake'`;
    }
    var result = await exe(sql);
    var categories = await exe(`SELECT * FROM vehicle_brand`)
    var is_login = (req.session.user_id) ? true : false;
    var data = 'Break '
    res.render('user/product_details.ejs', { result, categories, is_login,data })

});
router.get('/ac_part', async function (req, res) {
    var data = url.parse(req.url, true).query;
    let sql = "";
    if (data.cat) {
        if (data.cat == 'cabin_filter') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'AC Filter'`;
        }
        else if (data.cat == 'air_filter') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Air Filter'`;
        }
        else if (data.cat == 'radiator') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Radiator'`;
        }
        else if (data.cat == 'radiator_fan') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Raditor Fan Assembly'`;
        }
        else if (data.cat == 'blower_motor') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Blower Motor'`;
        }
        else if (data.cat == 'cooling_coil') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Cooling Coil'`;
        }
        else if (data.cat == 'cooling_valve') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Cooling Valve'`;
        }
        else if (data.cat == 'ac_compressor') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'AC Compressor'`;
        }
        else if (data.cat == 'ac_condenser') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'AC Condenser'`;
        }
        else {
            sql = `SELECT * FROM products WHERE product_part_type = 'AC'`;
        }
    } else {
        sql = `SELECT * FROM products WHERE product_part_type = 'AC'`;
    }
    var result = await exe(sql);
    var categories = await exe(`SELECT * FROM vehicle_brand`)
    var is_login = (req.session.user_id) ? true : false;
    var data = 'AC Parts '
    res.render('user/product_details.ejs', { result, categories, is_login,data })

});
router.get('/maintenance', async function (req, res) {
    var data = url.parse(req.url, true).query;
    let sql = "";
    if (data.cat) {
        if (data.cat == 'all_filter') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'All Filters'`;
        }
        else if (data.cat == 'auxilliary_battery') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Auxilliary Battery'`;
        }
        else if (data.cat == 'transmission_oil') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Transmission Oil'`;
        }
        else if (data.cat == 'towinf_washer') {
            sql = `SELECT * FROM products WHERE product_sub_part = 'Towinf Washer Cap'`;
        }
        else {
            sql = `SELECT * FROM products WHERE product_part_type = 'Maintenance'`;
        }
    } else {
        sql = `SELECT * FROM products WHERE product_part_type = 'Maintenance'`;
    }
    var result = await exe(sql);
    var categories = await exe(`SELECT * FROM vehicle_brand`)
    var is_login = (req.session.user_id) ? true : false;
    var data = 'Maintenance Parts '
    res.render('user/product_details.ejs', { result, categories, is_login ,data})
});
router.get("/vehicle/:id",async function(req,res){
    var sql = `SELECT * FROM products WHERE product_vehicle_type_id = '${req.params.id}'`
    var result = await exe(sql)
    var categories = await exe(`SELECT * FROM vehicle_brand`)
    var is_login = (req.session.user_id) ? true : false;
    var data3 =await exe(`SELECT * FROM vehicle_brand WHERE vehicle_id = '${req.params.id}'`)
    var data = data3[0].vehicle_name
    res.render('user/product_details.ejs', { result, categories, is_login ,data})

})
router.get("/product_list", function (res, res) {
    res.render('user/product_details.ejs')
})
router.get("/product_details/:id", async function (req, res) {
    var id = req.params.id;
    var sql = `SELECT * FROM products WHERE product_id ='${id}'`
    var result = await exe(sql)
    var is_login = (req.session.user_id) ? true : false;
    res.render('user/product_information.ejs', { result, is_login })
})
router.get('/login', function (req, res) {

    res.render('user/login.ejs')
})
router.post("/login", async function (req, res) {
    var d = req.body;
    var result = await exe(`SELECT * FROM customers WHERE mobile = ${d.number} AND email = '${d.email}'`)
    // res.send(d)
    if (result.length > 0) {
        req.session.user_id = result[0].id;
        console.log(req.session.user_id)
        await transferData(req, res);
        res.redirect("/add_to_cart")
    }
})
router.get('/signup', function (res, res) {
    res.render('user/sign_in.ejs')
})
async function transferData(req, res) {
    var carts = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    console.log(carts)
    for (var i = 0; i < carts.length; i++) {
        var customer_id = req.session.user_id;
        var product_id = carts[i].product_id;
        var qty = carts[i].qty;

        var data = await exe(`SELECT * FROM cart WHERE customer_id ='${customer_id}'AND product_id ='${product_id}' AND quantity ='${qty}'`)
        if (data.length > 0) {
            console.log("Match Data")
        } else {
            var sql = `INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, ?)`;
            var result = await exe(sql, [customer_id, product_id, qty]);
        }
    }
}
router.post("/signin", async function (req, res) {
    var d = req.body;
    var sql = `SELECT * FROM customers WHERE email = '${d.email}' AND mobile ='${d.mobile}'`
    var customers = await exe(sql)

    if (customers.length > 0) {
        req.session.user_id = customers[0].id;
        console.log("custmores login id", req.session.user_id)
        await transferData(req, res);
        // 
        res.redirect("/login")
    } else {
        var filename = ""
        if (req.files) {
            var filename = new Date().getTime() + req.files.image.name;
            req.files.image.mv('public/upload' + filename)
        }
        var sql = `INSERT INTO customers (name,mobile,email,image)VALUES(?,?,?,?)`
        var result = await exe(sql, [d.name, d.mobile, d.email, filename])
        req.session.user_id = result.insertId;
        console.log("inserted custmores id", req.session.user_id)
        await transferData(req, res);
        res.redirect("/")

    }
})
function checkLogin(req, res, next) {
    if (req.session.user_id) {
        next();
    } else {
        res.redirect('/')
    }
}
router.get("/buy_now/:id", checkLogin, async function (req, res) {
    var url_data = url.parse(req.url, true).query;
    var result = await exe(`SELECT * FROM products WHERE product_id ='${req.params.id}'`)
    res.render("user/checkout.ejs", { result, url_data })
})
router.post("/checkout", checkLogin, async function (req, res) {
    var d = req.body;
    console.log(d)
    var customer_id = req.session.user_id;
    var payment_status = "pending";
    var order_date = new Date().toISOString().slice(0, 10);
    var order_status = "placed";

    // Insert order master record
    var sql = `INSERT INTO orders
        (fullname,mobile,customer_id, country, state, city, area, pincode, total_amount, payment_method, payment_status, order_date, order_status) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    var result = await exe(sql, [
        d.fullname,
        d.mobile,
        customer_id,
        d.country,
        d.state,
        d.city,
        d.area,
        d.pincode,
        d.product_total,
        d.payment_mode,
        payment_status,
        order_date,
        order_status
    ]);

    var order_id = result.insertId;

    // Loop through products
    for (var i = 0; i < d.product_id.length; i++) {
        var product_info = await exe(`SELECT * FROM products WHERE product_id = '${d.product_id[i]}'`);

        if (product_info.length > 0) {
            var sql2 = `INSERT INTO order_products
                (order_id, customer_id, product_id, product_name, product_price, product_market_price, product_qty, product_total)
                VALUES (?,?,?,?,?,?,?,?)`;

            await exe(sql2, [
                order_id,
                customer_id,
                d.product_id[i],
                product_info[0].product_name,
                product_info[0].product_price,
                product_info[0].product_market_price,
                d.qty[i],
                d.product_total[i]
            ]);
        }
    }

    var carts = await exe(`DELETE FROM cart WHERE customer_id = '${customer_id}'`)
    res.redirect(`/payment/${order_id}`);
});

router.get("/payment/:id", async function (req, res) {
    var sql = `SELECT * FROM orders WHERE order_id = ${req.params.id}`
    var result = await exe(sql)
    res.render("user/payment.ejs", { result })
})
router.post('/payment_success/:id', async function (req, res) {
    var d = req.body;
    var payment_status = "paid"
    var sql = `UPDATE orders SET transaction_id = ?,payment_status = ? WHERE order_id = '${req.params.id}'`
    var result = await exe(sql, [d.razorpay_payment_id, payment_status])
    // res.send(result)


    res.redirect(`/myorder`)
})
router.get("/myorder", checkLogin, async function (req, res) {
    console.log(req.session.user_id)
    var sql = `SELECT * FROM orders WHERE customer_id = ${req.session.user_id}`
    var result2 = await exe(`SELECT * FROM customers WHERE id = ${req.session.user_id}`)
    var result = await exe(sql)
    res.render('user/order_details.ejs', { result, result2 })
})
router.get("/print_order/:id", checkLogin, async function (req, res) {
    var data = await exe(`SELECT * FROM orders WHERE order_id = '${req.params.id}'`)
    var result = await exe(`SELECT * FROM order_products WHERE order_id = '${req.params.id}'`)
    var custmores = await exe(`SELECT * FROM customers WHERE id = '${req.session.user_id}'`)
    res.render('user/order_print.ejs', { data, result, custmores })
})
router.get("/add_to_cart/:id", async function (req, res) {
    var product_id = req.params.id;
    var url_data = url.parse(req.url, true).query;
    var qty = (url_data.qty) ? url_data.qty : 1;

    if (req.session.user_id) {
        var customer_id = req.session.user_id;
        var sql = `SELECT * FROM cart WHERE customer_id = ? AND product_id = ?`;
        var info = await exe(sql, [customer_id, product_id]);

        if (info.length > 0) {
            console.log(info);
        } else {
            var sql = `INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, ?)`;
            var result = await exe(sql, [customer_id, product_id, qty]);
        }

        res.redirect(`/add_to_cart`);
    } else {

        var cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
        var obj = {
            product_id: product_id,
            qty: qty,

        };
        var already = false;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].product_id == product_id) {
                already = true;
                break;
            }
        }

        if (!already) {
            cart.push(obj);
        }
        res.cookie("cart", JSON.stringify(cart), { maxAge: 3600000 });
        res.redirect('/add_to_cart');
    }

});
router.get('/add_to_cart', async function (req, res) {

    var categories = await exe(`SELECT * FROM vehicle_brand`);

    var carts = [];

    if (req.session.user_id) {
        const customer_id = req.session.user_id;
        const sql = `SELECT * FROM cart WHERE customer_id = ?`;
        carts = await exe(sql, [customer_id]);

    }
    else {
        if (req.cookies.cart) {
            try {
                carts = JSON.parse(req.cookies.cart);

            } catch (err) {
                console.error("❌ Error parsing cart cookie:", err);
                carts = [];
            }
        } else {
            carts = [];
        }
    }


    var cart_data = [];
    for (var i = 0; i < carts.length; i++) {
        var result = await exe(`SELECT * FROM products WHERE product_id = ?`, [carts[i].product_id]);
        if (result.length > 0) {
            const obj = {
                cart_id: (carts[i].product_id),
                product_name: result[0].product_name,
                product_image: result[0].product_image,
                product_price: result[0].product_price,
                product_part: result[0].product_part_type,
                product_part_type: result[0].product_sub_part,
                qty: carts[i].quantity || carts[i].qty || 1,
            };
            cart_data.push(obj);
        } else {
            console.log(`⚠️ Product not found for ID: ${carts[i].product_id}`

            );
        }
    }
    const is_login = req.session.user_id ? true : false;
    res.render('user/cart.ejs', {
        result: cart_data,
        is_login,
        categories
    });
});
router.get('/delete_cart/:id',async function (req, res) {
    const id = req.params.id;

    if (req.session.user_id) {
        var customer_id = req.session.user_id;
        var sql = `DELETE FROM cart WHERE cart_id = ? AND customer_id = ?`;
        var result =await exe(sql,[id,customer_id]);
        res.redirect("/add_to_cart");

    } else {
        let carts = JSON.parse(req.cookies.cart || '[]');
        // filter करून फक्त तो product काढून टाक
        carts = carts.filter(item => item.product_id != id);


        res.cookie("cart", JSON.stringify(carts), { path: "/" });
        res.redirect("/add_to_cart");
    }
});

router.get("/updateqty/:id", (req, res) => {
    let id = String(req.params.id);
    let qty = parseInt(req.query.qty);

    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    console.log("Before Update:", cart, "New Qty:", qty, "Id:", id);

    let updated = false;

    for (let i = 0; i < cart.length; i++) {
        if (String(cart[i].product_id) === id) {
            if (qty <= 0) {
                cart.splice(i, 1);   // remove item if qty <= 0
                console.log("Removed product:", id);
            } else {
                cart[i].qty = qty;   // update qty
                console.log("Qty Updated for product:", id);
            }
            updated = true;
            break;
        }
    }

    if (!updated) {
        console.log("❌ Product not found in cart, nothing updated.");
    }

    res.cookie("cart", JSON.stringify(cart), { maxAge: 3600000, httpOnly: true, path: "/" });

    console.log("After Update:", cart);
    res.redirect("/add_to_cart");
});

router.get('/buy_cart/:id', checkLogin, async function (req, res) {
    var total = req.params.id;
    var result = await exe(`SELECT 
    cart.cart_id,
    cart.quantity,
    products.product_id,
    products.product_name,
    products.product_price,
    products.product_image
    FROM cart
    INNER JOIN products
    ON cart.product_id = products.product_id;`)

    res.render('user/cart_data.ejs', { result, total })
})

router.get('/profile', checkLogin, async function (req, res) {
    var result = await exe(`SELECT * FROM customers WHERE id = '${req.session.user_id}'`)
    res.render('user/profile.ejs', { result })
})
router.post('/update_profile', checkLogin, async function (req, res) {
    var d = req.body;   
    var filename = d.old_image;
    if (req.files) {
        filename = new Date().getTime() + req.files.image.name;
        req.files.image.mv('public/upload/' + filename)
    }   
    var sql = `UPDATE customers SET name = ?, mobile = ?, email = ?, image = ? WHERE id = ?`
    var result = await exe(sql, [d.name, d.mobile, d.email, filename, req.session.user_id])
    res.redirect('/profile')
})
router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/')
});
router.get("/profile", (req, res) => {
    if (!req.session.user_id) {
        return res.redirect("/login"); 
    }
    res.render("profile", { user: res.locals.user });
});

module.exports = router;