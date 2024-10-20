import mongoose, { Types } from "mongoose"
const {Schema , model} = mongoose

const cartSchema = new Schema({
    user:{
        type: Types.ObjectId,
        ref: 'User'
    },
    cartItems:[
        {
            product: {
                type: Types.ObjectId,
                ref: 'Product'
            },
            quantity:{
                type:Number,
                default:1
            },
            price:Number,
        }
    ],
    total:Number,
    discount:String
    ,
    totalCartPriceAfterDiscount: Number,
}, { timestamps: true, versionKey: false })

export const Cart = mongoose.models.Cart || model('Cart', cartSchema) 