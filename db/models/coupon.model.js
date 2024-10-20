import mongoose, { model, Schema, Types } from "mongoose";

const CouponSchema = new Schema({
    couponCode:{
        type:String, 
        required:true, 
        unique:true,
    },
    discountAmount:{
        type:Number,
        required:true,
    },
    discountType:{
        type:String,
        required:true,
        enum:['percentage' , 'fixed']
    },
    expiryDate:{
        type:Date,
        required:true,
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true,
    }
}, { timestamps: true, versionKey: false })

export const Coupon = mongoose.models.Coupon || model('Coupon', CouponSchema); 