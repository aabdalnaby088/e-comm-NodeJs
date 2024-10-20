import mongoose, { model, Schema, Types } from "mongoose";

const subCategorySchema = new Schema({
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
    category: {
        type:Types.ObjectId, 
        ref:'Category',
        required:true
    },
    createdBy: {
        type:Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type:Types.ObjectId,
        ref: 'User'
    },

}, { timestamps: true, versionKey: false })

subCategorySchema.post('init' , (doc) => {
    if (doc.image) doc.image = process.env.BASE_URL + 'subCategories/' + doc.image
})


export const subCategory = mongoose.models.subCategory || model('subCategory', subCategorySchema); 