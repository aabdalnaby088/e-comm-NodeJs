import { User } from "../../../db/models/index.js"
import { AppError } from "../../utils/appError.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { config } from "dotenv"
config(); 
export const signUp = async (req, res, next) => {
    let newUser = new User (req.body);
    await newUser.save(); 
    if(!newUser){
        return next(new AppError("User not created", 400));
    }
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_KEY); 
    res.status(201).json({message: "success", newUser, token});
}


export const signIn =  async (req, res, next) => {
    const {email, password} = req.body;
    const getUser = await User.findOne({email}); 
    if(!getUser){
        return next(new AppError("User not found", 404));
    }
    const isMatch =  bcrypt.compareSync(password, getUser.password)
    if(isMatch){
        const token = jwt.sign({ userId: getUser._id, role: getUser.role }, process.env.JWT_KEY); 
        res.status(200).json({message: "success", token});
    }
    next(new AppError("incorrect email or password" , 401))
}


export const updatePassword = async (req, res, next) => {
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user._id); 
    if(!user){
        return next(new AppError("User not found", 404));
    }
    const isMatch =  bcrypt.compareSync(oldPassword, user.password)
    if(!isMatch){
        return next(new AppError("incorrect old password", 401));
    }
    user.password = newPassword
    user.passwordChangedAt = Date.now(); 
    await user.save();
    res.status(200).json({message: "success", user});
}




export const protectedRoutes = async (req, res, next) => {
    const {token} = req.headers;  
    let userPayload = null; 
    if(!token){
        return next(new AppError("token not found", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if(err){
            return next(new AppError(err, 401));
        }
        userPayload = payload;
    });

    const user = await User.findById(userPayload.userId);
    
    if(!user){
        return next(new AppError("User not found", 404));
    }

    if(!user.passwordChangedAt){
        req.user = user
        return next();
    }

    let time = parseInt(user.passwordChangedAt.getTime() / 1000)
    if(time > userPayload.iat){
        return next (new AppError("token is not valid" , 401)); 
    }    
    req.user = user
    next()
    
}


export const allowedTo = (...roles) => {
    
    return (req, res, next) => {
        
        const { role } = req.user;
        if (roles.includes(role)){
            return next();
        }
        return next(new AppError("you are not authorized to do this action", 401))
    }
} 