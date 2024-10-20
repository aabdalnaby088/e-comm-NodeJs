import { Coupon, User } from "../../../db/models/index.js"
import { AppError } from "../../utils/appError.js"


export const addCoupon = async (req, res, next) => {
    const isExist = await Coupon.findOne({couponCode:req.body.couponCode})
    if(isExist){
        return next(new AppError('coupon already exists', 409)); 
    }
    req.body.createdBy = req.user._id; 
    const newCoupon = await Coupon.create(req.body); 
    res.status(201).json({message: 'coupon created successfully', data: newCoupon})
}

export const updateCoupon = async (req, res, next) => {
    const couponToUpdate = await Coupon.findById(req.params.id); 
    if(!couponToUpdate){
        return next(new AppError('coupon not found', 404));
    }
    if(req.body.couponCode){
        const isExist = await Coupon.findOne({couponCode:req.body.couponCode})
        if(isExist){
            return next(new AppError('coupon already exists', 409));
        }
        couponToUpdate.couponCode = req.body.couponCode
    }
    if (req.body.expiryDate){
        couponToUpdate.expiryDate = req.body.expiryDate
    }
    await couponToUpdate.save(); 
    res.status(200).json({message: 'success', data: couponToUpdate})
}


export const removeCoupon = async (req, res, next) => {
    const couponToRemove = await Coupon.findByIdAndDelete(req.params.id);
    if(!couponToRemove){
        return next(new AppError('coupon not found', 404));
    }
    res.status(200).json({message: 'success'}); 
}


export const getCoupons = async (req, res, next) => {
    const coupons = await Coupon.find().populate('createdBy', 'name email'); 
    if(!coupons){
        return next(new AppError('coupons not found', 404));
    }
    res.status(200).json({message: 'success', data: coupons})
}