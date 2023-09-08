const {Schema, model} = require('mongoose');
const moment = require('moment-timezone')
moment.tz.setDefault("America/Bogota")
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
    default: ()=>moment().format(),
  },
});

const Product = model('Product', productSchema);

module.exports = Product;
