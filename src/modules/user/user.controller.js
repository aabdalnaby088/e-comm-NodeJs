import { User } from "../../../db/models/index.js"
import { ApiFeature } from "../../utils/apiFeature.js";
import { AppError } from "../../utils/appError.js";


export const addUser = async (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })
    await newUser.save(); 
    res.status(201).json({ message: "success" , newUser});
}

export const getAllUsers = async (req,res, next) => {
    const ApiFeatures = new ApiFeature(User.find(), req.query).pagination().fields().filter().sort().search();

    const users = await ApiFeatures.mongooseQuery; 
    if(!users){
        return next(new AppError("No users found", 404));
    }
    res.status(200).json({message:"success" , users});
}

export const getUser = async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user){
        return next(new AppError("No user found", 404));
    }
    res.status(200).json({message:"success" , user});
}

export const updateUser = async (req, res, next) => {
    const id = req.params.id;
    let userToBeUpdated = await User.findById(id); 
    
    if(!userToBeUpdated){
        return next(new AppError("No user found", 404));
    }
    if(req.body.name){
        userToBeUpdated.name = req.body.name;
    }
    if(req.body.email){
        userToBeUpdated.email = req.body.email;
        userToBeUpdated.isVerified = false; 
    }
    if(req.body.password){
        userToBeUpdated.password = req.body.password;
    }
    if(req.body.role){
        userToBeUpdated.role = req.body.role;
    }
    await userToBeUpdated.save();
    res.status(200).json({message:"success" , userToBeUpdated});
}

export const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    if(!deletedUser){
        return next(new AppError("No user found", 404));
    }
    res.status(200).json({message:"success"});
}