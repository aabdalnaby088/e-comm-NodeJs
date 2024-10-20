import mongoose from "mongoose"
const {Schema, model} = mongoose


const orderSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    orderItems:[
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity:Number,
            price: Number
        }
    ],
    totalOrderPrice:Number,
    shippingAddress: {
        city: String,
        phone: String,
        street: String,
        buildingNo: Number,
        floor: Number,
        departmentNo: Number
    },
    paymentMethod: {
        type:String,
        enum: ['card', 'cash'],
        default: 'cash'
    },
    isCanceled:{
        type:Boolean,
        default:false
    },
    orderStatus:{
        type:String,
        enum: ['pending', 'shipped', 'fulfilled', 'cancelled'],
        default: 'pending'
    },
    deliveredAt: {
        type: Date,
    }
})

export const Order = mongoose.models.Order || model('Order', orderSchema);