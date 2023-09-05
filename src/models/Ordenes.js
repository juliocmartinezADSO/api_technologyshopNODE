const {Schema, model} = require('mongoose')

const orderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    products:[
        {
            product:{
                type:Schema.Types.ObjectId,
                ref:'Products',
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
        default:Date.now
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
