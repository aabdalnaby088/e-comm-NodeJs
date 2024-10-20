import mongoose, { model, Schema, Types } from "mongoose";

const categorySchema = new Schema({
    name: {
        type:String, 
        unique:[true , 'name is required'], 
        trim:true, 
        required:true, 
    }, 
    slug:{
        type:String,
        unique:true,
        lowercase:true,
        required:true
    }, 
    image:String,
    createdBy: {
        type:Types.ObjectId,
        ref:'User', 
    },
    updatedBy: {
        type:Types.ObjectId,
        ref:'User', 
    },
} , {timestamps:true, versionKey:false})    
categorySchema.post('init', function(doc){
    if (doc.image) doc.image = process.env.BASE_URL + 'categories/' + doc.image
})


export const Category = mongoose.models.Category || model('Category' , categorySchema) ; 