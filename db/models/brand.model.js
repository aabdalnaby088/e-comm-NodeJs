import mongoose, { model, Schema, Types } from "mongoose";

const brandSchema = new Schema({
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
    image: String,
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    updatedBy:{
        type: Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true, versionKey: false })

brandSchema.post('init', (doc) => {
    doc.image = 'http://localhost:3000/uploads/brands/' + doc.image
})


export const Brand = mongoose.models.Brand || model('Brand', brandSchema); 