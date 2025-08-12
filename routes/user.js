var express = require('express');
var exe = require('./../connection');
var url = require('url')
var router = express.Router();

router.get('/', function(req, res) {
    res.render('user/home.ejs');
});
router.get('/about', function(req, res) {
    res.render('user/about.ejs');
});
router.get('/menu',function(req,res){
  res.render('user/menu.ejs')
})
router.get('/gallery',function(req,res){
  res.render('user/gallery.ejs')
})
router.get('/contact',function(req,res){
  res.render('user/contact.ejs')
})
router.get('/blog',function(req,res){
  res.render('user/blog.ejs')
})

router.get('/menu_list/:id', async function(req, res) {
    var table_id = req.params.id;
    req.session.table_id = table_id;
    console.log("Table id →", req.session.table_id);

    try {
        var orderCheck = await exe(`SELECT * FROM orders WHERE table_id = '${table_id}' AND status = 'Pending'`);
        if (orderCheck.length > 0) {
            return res.render('user/order_exists.ejs', {
                message: "Order already placed for this table. Please wait or contact staff.",
                table_id: table_id
            });
        }

        var sql = `SELECT * FROM menu`;
        var cart = await exe(`SELECT * FROM carts WHERE table_id = '${table_id}'`);
        var type = await exe(`SELECT * FROM type`);
        var result = await exe(sql);

        res.render('user/menu_list.ejs', { result, type, id: table_id, cart });

    } catch (err) {
        console.error("Error fetching menu or type:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/add_to_cart/:id",async function (req, res) {

    var product_id = req.params.id;
    var url_data = url.parse(req.url, true).query;
    if (req.session.table_id) {
        var table_id = req.session.table_id;
        var qty = url_data.qty;

        var sql = `SELECT * FROM carts WHERE table_id = ? AND product_id = ?`
        var info = await exe(sql, [table_id, product_id])
        if (info[0] > 0) {

        } else {
          if(req.session.table_id == 0){
          }
          else{
            var sql = `INSERT INTO carts (table_id,product_id,qty)VALUES(?,?,?)`
            var result = await exe(sql, [table_id, product_id, qty])
          }
        }
        res.redirect(`/menu_list/${req.session.table_id}`)

    }
  });

router.get('/remove_cart_item/:id', async function(req, res) {
 var table_id = req.session.table_id;
  var sql = `DELETE FROM carts WHERE table_id = '${req.session.table_id}' AND product_id = '${req.params.id}'`;
  var result = await exe(sql)
  res.redirect(`/menu_list/${table_id}`)
});

router.get('/my_order/:id',async function(req,res){
  var sql = `SELECT * FROM carts WHERE table_id = '${req.params.id}'`
  var result = await exe(sql)
  console.log(result)

  var details = []
  for (var i = 0; i < result.length; i++) {
  var info = await exe(`SELECT * FROM menu WHERE id = '${result[i].product_id}'`);
  
  if (info.length > 0) {
    var obj = {
      "product_id": result[i].product_id,
      "menu_name": info[0].menu_name,
      "menu_price": info[0].menu_price,
      "menu_type": info[0].type_id,
      "menu_image": info[0].menu_image,
      "qty": result[i].qty
    };
    details.push(obj);
  } else {
    console.warn(`Product not found in menu table for product_id = ${result[i].product_id}`);
  }
}
  var packet={"result":details ,"table_id":req.params.id}
  res.render('user/details.ejs',packet)
})
router.post('/confirm_order',async function(req,res){
  var table_id = req.body.table_id
  var products = req.body.products;
  var order_date = new Date().toISOString().slice(0, 10)
   for (let i = 0; i < products.length; i++) {
      const { product_id, qty } = products[i];
      const sql = `
        INSERT INTO orders (table_id,product_id,quantity,order_date) 
        VALUES ('${table_id}', '${product_id}', '${qty}','${order_date}')
      `;
      var result =await exe(sql); 
      }
    var data= await exe("UPDATE tabel SET status = 'ordered' WHERE tabel_id = ?", [table_id]);
  // res.send(result)
  res.redirect('/thanks')
})

router.get('/categories/:id',async function(req,res){
    var data = url.parse(req.url, true).query;
    var result =await exe(`SELECT * FROM menu WHERE type_id = '${data.cat}'`)
    // res.redirect(`/menu_list/${req.params.id}`,{result})
    res.send(result)
})

router.get('/thanks',function(req,res){
  res.render('user/thanks.ejs')
})






module.exports = router;