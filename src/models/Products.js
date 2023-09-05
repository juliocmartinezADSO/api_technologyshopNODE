const {Schema, model} = require('mongoose');

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  stock:{
    type:Number,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = model('Product', productSchema);

module.exports = Product;
