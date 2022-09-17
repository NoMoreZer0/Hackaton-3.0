const express = require('express');
const router = express.Router();
var Cart = require('../models/Cart');

var Product = require('../models/Product');

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {}, total_kol: 0, total_price: 0 });
  Product.findById(productId, function(err, product) {
    if (err) return res.redirect('/');
    cart.add(product, product.id);
    req.session.cart = cart;
  });
});

module.exports = router;