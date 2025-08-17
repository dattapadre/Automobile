var express = require('express')
var router = express.Router()
var url = require('url')
var exe = require('../connection')

router.get("/", function (req, res) {
    res.render("user/home.ejs")
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
    res.render('user/product_details.ejs', { result, categories })
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
    res.render('user/product_details.ejs', { result, categories })

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
    res.render('user/product_details.ejs', { result, categories })

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

    res.render('user/product_details.ejs', { result, categories })

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

    res.render('user/product_details.ejs', { result, categories })

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

    res.render('user/product_details.ejs', { result, categories })

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

    res.render('user/product_details.ejs', { result, categories })

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

    res.render('user/product_details.ejs', { result, categories })

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

    res.render('user/product_details.ejs', { result, categories })

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

    res.render('user/product_details.ejs', { result, categories })
});
router.get("/product_list", function (res, res) {
    res.render('user/product_details.ejs')
})
router.get("/add_to_cart/:id", function (req, res) {
    var id = req.params.id;
    res.render("user/cart.ejs")
})
router.get("/product_details/:id", async function (req, res) {
    var id = req.params.id;
    var sql = `SELECT * FROM products WHERE product_id ='${id}'`
    var result = await exe(sql)
    var is_login = (req.session.user_id) ? true : false;
    console.log(is_login)
    res.render('user/product_information.ejs', { result, is_login })
})
router.post("/signin", async function (req, res) {
    var d = req.body;
    var sql = `SELECT * FROM customers WHERE email = '${d.email}'`
    var customers = await exe(sql)
    if (customers.length > 0) {
        req.session.user_id = customers[0].id;
        console.log("custmores login id", req.session.user_id)
        res.send({ status: 'success', new_user: false });
    } else {
        var sql = `INSERT INTO customers (name,mobile,email)VALUES(?,?,?)`
        var result = await exe(sql, [d.name, d.mobile, d.email])
        req.session.user_id = result.insertId;
        console.log("inserted custmores id", req.session.user_id)
        res.send({ status: 'success', new_user: true });
    }
})
function checkLogin(req, res, next) {
      req.session.user_id = 1
    if (req.session.user_id) {
        next();
    } else {
        res.redirect('/')
    }
}
router.get("/buy_now/:id",checkLogin,async function (req, res) {
    var url_data = url.parse(req.url, true).query;
    var result = await exe(`SELECT * FROM products WHERE product_id ='${req.params.id}'`)
    res.render("user/checkout.ejs", { result, url_data })
})
router.post("/checkout",checkLogin,async function (req, res) {
    var d =req.body;
    var customer_id = req.session.user_id;
    var payment_status = "pending";
    var order_date = new Date().toISOString().slice(0, 10);
    var order_status = "placed";

    var product = await exe(`SELECT * FROM products WHERE product_id = '${d.product_id}'`)
    console.log(product)
    var sql = `INSERT INTO orders(customer_id,country,state,city,area,pincode,total_amount,payment_method,payment_status,order_date,order_status)VALUES(?,?,?,?,?,?,?,?,?,?,?)`
    var result = await exe(sql,[customer_id,d.country,d.state,d.city,d.area,d.pincode,d.product_total,d.payment_mode,payment_status,order_date,order_status])

    var order_id = result.insertId;

    var sql2 =`INSERT INTO order_products(order_id,customer_id,product_id,product_name,product_market_price,product_price,product_qty,product_total)VALUES(?,?,?,?,?,?,?,?)`
    var data = await exe(sql2,[order_id,customer_id,d.product_id,product[0].product_name,product[0].product_market_price,product[0].product_price,d.qty,d.product_total])
    res.redirect(`/payment/${order_id}`)
})
router.get("/payment/:id",async function(req,res){
    var sql = `SELECT * FROM orders WHERE order_id = ${req.params.id}`
    var result = await exe(sql)
    res.render("user/payment.ejs",{result})
})
router.post('/payment_success/:id',async function(req,res){
    var d = req.body;
    var payment_status = "paid"
    var sql =`UPDATE orders SET transaction_id = ?,payment_status = ? WHERE order_id = '${req.params.id}'`
    var result = await exe(sql,[d.razorpay_payment_id,payment_status])
    // res.send(result)
    res.redirect(`/myorder/${req.params.id}`)
})
router.get("/myorder/:id",checkLogin,async function(req,res){
    var sql = `SELECT * FROM orders WHERE order_id = ${req.params.id}`
    var result = await exe(sql)
    res.render('user/order_details.ejs',{result})
})


module.exports = router;