var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  cart: { type: Object, required: true},
  payment_id: { type: String, required: true }
});

module.exports = mongoose.model('Order', schema);