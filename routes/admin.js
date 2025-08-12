var express = require('express')
var exe = require('./../connection');
var router = express.Router()

// router.use(checklogin);

router.post('/login', async function (req, res) {
    var d = req.body;
    var sql = `SELECT * FROM admin WHERE email = '${d.username}' AND mobile_no = '${d.password}'`;
    var result = await exe(sql);
    if (result.length > 0) {
        req.session.admin = result[0];
        res.redirect('/admin');
    } else {
        res.redirect('/admin/login');
    }
})
function checklogin(req, res, next) {
    if (req.session.admin) {    
            next();
    } else {
        res.redirect('/admin/login');
    }
}
router.get('/login',function(req,res){
    res.render('admin/login.ejs')
})
router.get('/',checklogin,async function (req, res) {
    const result = await exe(`SELECT * FROM tabel`);
    const tablesWithOrder = await Promise.all(result.map(async (table) => {
        const [pending] = await exe(`SELECT * FROM orders WHERE table_id = ? AND status = 'pending' LIMIT 1`, [table.tabel_id]);
        return {
            ...table,
            activeOrder: pending || null
        };
    }));
    var sum = await exe(`SELECT COUNT(menu_name) AS total_items FROM menu;`)
    var table = await exe(`SELECT COUNT(table_name) AS total_table FROM tabel;`)
    var type = await exe(`SELECT COUNT(type_name) AS type FROM type;`)
    var order = await exe(`SELECT COUNT(status) AS pending_order FROM orders WHERE status = 'pending';`);

    res.render('admin/dashbord.ejs', {
        result: tablesWithOrder,
        sum: sum,
        table, type, order
    });


});

router.get('/menu',async function (req, res) {
    var result = await exe(`SELECT * FROM type`)
    var list = await exe(`SELECT * FROM menu m JOIN type t ON m.type_id = t.type_id`)
    res.render('admin/menu.ejs', { result, list })
})
router.post('/save_menu', async function (req, res) {
    var d = req.body;
    var add_date = new Date().toISOString().slice(0, 10);
    var filename = ""
    if (req.files) {
        filename = new Date().getTime() + req.files.image.name;
        req.files.image.mv('./public/images/' + filename)
    }
    var sql = `INSERT INTO menu (menu_name,menu_desc,menu_price,type_id,date,menu_image)VALUES('${d.menu_name}','${d.menu_desc}','${d.price}','${d.type}','${add_date}','${filename}')`
    var result = await exe(sql)
    // res.send(result)
    res.redirect('/admin/menu')
})

router.get('/edit_menu/:id', async function (req, res) {
    var result = await exe(`SELECT * FROM menu WHERE id = '${req.params.id}'`)
    var result2 = await exe(`SELECT * FROM type`)
    res.render('admin/edit_menu.ejs', { result, result2 })
})
router.post('/update_menu', async function (req, res) {
    var d = req.body;
    var filename = ""
    if (req.files) {
        var filename = new Date().getTime() + req.files.image.name;
        req.files.image.mv('./public/images/' + filename)
    }
    var sql = `UPDATE menu SET menu_name = ?, menu_desc = ? , menu_price = ?,type_id = ?, menu_image = ? WHERE id = ?`
    var result = await exe(sql, [d.menu_name, d.menu_desc, d.price, d.type, filename, d.id])
    // res.send(result)
    res.redirect('/admin/menu')
})
router.get("/delete_menu/:id", async function (req, res) {
    var result = await exe(`DELETE FROM menu WHERE id = ${req.params.id}`)
    res.redirect('/admin/menu')
})

router.get('/add_table', async function (req, res) {
    var sql = `SELECT * FROM tabel`
    var result = await exe(sql)
    res.render('admin/add_table.ejs', { result })
})
router.get('/edit_table/:id', async function (req, res) {
    var id = req.params.id
    var sql = `SELECT * FROM tabel WHERE tabel_id = ${id}`
    var result = await exe(sql)
    res.render('admin/edit_table.ejs', { result })
})
router.post('/update_table', async function (req, res) {
    var d = req.body
   var sql = `UPDATE tabel SET table_name = '${d.table_name}' WHERE tabel_id = ${d.table_id}`;
    var result = await exe(sql);
    console.log(sql);
    res.redirect('/admin/add_table')
})
router.post('/save_table', async function (req, res) {
    var d = req.body;
    var date = new Date().toISOString().slice(0, 10);
    var table = await exe(`INSERT INTO tabel (table_name, add_date) VALUES ('${d.table_name}', '${date}')`);
    res.redirect('/admin/add_table')
})
router.get('/delete_table/:id', async function (req, res) {
    var id = req.params.id  
    var sql = `DELETE FROM tabel WHERE tabel_id = ${id}`
    var result = await exe(sql)
    res.redirect('/admin/add_table')
})
router.get('/type', async function (req, res) {
    var result = await exe(`SELECT * FROM type`)
    res.render('admin/type.ejs', { result })
})
router.post('/save_type', async function (req, res) {
    var sql = `INSERT INTO type(type_name)VALUES('${req.body.typename}')`
    var result = await exe(sql)
    // res.send(result)
    res.redirect('/admin/type')
})
router.get('/edit_type/:id', async function (req, res) {
    var result = await exe(`SELECT * FROM type WHERE type_id = '${req.params.id}'`)
    res.render('admin/edit_type.ejs', { result })   
})
router.post('/update_type', async function (req, res) {
    var d = req.body;
    var sql = `UPDATE type SET type_name = '${d.typename}' WHERE type_id = ${d.id}`
    var result = await exe(sql)
    // res.send(d)
    res.redirect('/admin/type')
})
router.get('/delete_type/:id', async function (req, res) {  
    var id = req.params.id
    var sql = `DELETE FROM type WHERE type_id = ${id}`
    var result = await exe(sql)
    res.redirect('/admin/type')
})

router.get('/order', async function (req, res) {
    var list = await exe(`SELECT 
    orders.order_id,
    orders.table_id,
    orders.quantity,
    orders.order_date,
    orders.status,

    menu.menu_name AS menu_name,
    menu.menu_price,
    menu.menu_image,

    type.type_name

FROM orders
JOIN menu ON orders.product_id = menu.id
JOIN type ON menu.type_id = type.type_id
ORDER BY orders.order_date DESC;
`)
    res.render('admin/order.ejs', { list })
})
router.get('/order_list', async (req, res) => {
    try {
        const orders = await exe(`SELECT * FROM orders ORDER BY order_id DESC`);
        res.render('admin/order_list', { orders });
    } catch (err) {
        console.error("Order fetch error:", err);
        res.send("Error fetching orders");
    }
});
router.get('/pay_order/:id', async function (req, res) {
    const tableId = req.params.id;

    // 1. Get order summary
    const order = {
        order_id: Math.floor(Math.random() * 1000000), // तुम्ही DB मधून आणू शकता
        order_date: new Date(),
        table_no: tableId
    };

    // 2. Get all items for the table with menu info
    const items = await exe(`
    SELECT 
      m.menu_name,
      m.menu_price,
      o.quantity
    FROM orders o
    JOIN menu m ON o.product_id = m.id
    WHERE o.table_id = ? AND o.status = 'pending'
  `, [tableId]);

    res.render('admin/payment.ejs', { order, items });
});
router.post("/payment_success/:id", async function (req, res) {
    var status = 'paid'
    var table_id = req.session.table_id
    var data = await exe(`UPDATE tabel SET status = 'paid' WHERE tabel_id = ${req.params.id}`);
    var sql =`UPDATE orders SET  status = '${status}' WHERE table_id = ${req.params.id}`

    var cart_data = await exe(`DELETE FROM carts WHERE table_id = ${table_id}`);
    var result = await exe(sql)
    res.redirect(`/thanks`)
})
router.get('/logout',checklogin,function(req,res){
    req.session.admin = null;
    res.redirect('/admin/login');   
})
router.get('/profile', checklogin,async function(req, res) {
    var result =await exe(`SELECT * FROM admin `);
    res.render('admin/profile.ejs',{result});
});


module.exports = router