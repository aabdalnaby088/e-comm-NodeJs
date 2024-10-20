import mongoose, { model, Schema, Types } from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        unique: [true, 'name is required'],
        trim: true,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    imageCover: String,
    images:[String],
    price: {
        type:Number,
        required: true,
        min:0, 
    },
    priceAfterDiscount: {
        type:Number,
        // required: true,
        min:0, 
    },
    desc:{
        type:String,
        required:true,
        trim:true, 
        minLength:30,
        maxLength:3000
    },
    sold:Number, 
    stock:{
        type:Number,
        min:0,
        required:true
    },
    category: {
        type: Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory:{
        type: Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    brand:{
        type: Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    rateAvg:{
        type:Number,
        min:0,
        max:5,
    },
    rateCount:Number,
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true, versionKey: false, toJSON: {virtuals: true} })

ProductSchema.post('init' , (doc)=> {
    if (doc.imageCover) doc.imageCover = process.env.BASE_URL + 'products/' + doc.imageCover
    if (doc.images) doc.images = doc.images.map((image) => process.env.BASE_URL + 'products/' + image)
})

ProductSchema.virtual('reviews' , {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
})

ProductSchema.pre(/^find/ , function(){
    this.populate('reviews')
})

export const Product = mongoose.models.Product || model('Product', ProductSchema); 