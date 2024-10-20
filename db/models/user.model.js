import mongoose, { model, Schema, Types } from "mongoose";
import bcrypt from 'bcrypt'
const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email:{
        type: String,
        trim: true,
        required: true,
    },
    password:{
        type: String,
        trim: true,
        required: true,
    },
    role:{
        type: String,
        trim: true,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    passwordChangedAt : Date,
    wishlist: [{type:Types.ObjectId, ref:"product"}],
    addresses: [{
        city:String, 
        phone:String, 
        street:String, 
        buildingNo: Number, 
        floor:Number, 
        departmentNo:Number
    }],
}, { timestamps: true, versionKey: false })


UserSchema.pre('save' , function () {    
    this.password = bcrypt.hashSync(this.password, 8);
})

export const User = mongoose.models.User || model('User', UserSchema); 