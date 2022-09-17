const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
  image_path: { type: String, required: true }, //Path to the image of the product 
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }
});

const model = mongoose.model('Product', schema);

module.expotrs = model