const {Schema, model} = require('mongoose')
const moment = require('moment-timezone')
const timezone = moment.tz("America/Bogota")
const orderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[
        {
            productId:{
                type:Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
    ],
    orderDate:{
        type:Date,
        default:timezone
    },
    status:{
        type:String,
        enum:['En proceso', 'Completada', 'Cancelada'],
        default:'En proceso'
    },
    total:{
        type:Number,
        required:true
    }
});

const Order = model('Order', orderSchema)

module.exports = Order
