import mongoose, { model, Schema, Types } from "mongoose";

const ReviewSchema = new Schema({
    comment: String,
    user: {
        type:Types.ObjectId, 
        ref: 'User',
    },
    rate:{
        type:Number,
        min:0,
        max:5,
        required:true
    }, 
    product:{
        type:Types.ObjectId, 
        ref:'Product',
        required:true, 
    }
}, { timestamps: true, versionKey: false })

ReviewSchema.post(/^find/, function (){
    this.populate('user');
    this.populate('product');
})

export const Review = mongoose.models.Review || model('Review', ReviewSchema); 