import { User } from "../../../db/models/index.js"
import { AppError } from "../../utils/appError.js";


export const addAddress = async (req, res, next) => {

    const address = await User.findByIdAndUpdate(req.user._id, { $push: { addresses: req.body} }, {new: true}); 

    address || next(new AppError('Error May be user not found', 404))
    !address || res.status(201).json({message: 'success', Addresses: address.addresses});

}


export const removeAddress = async (req, res, next) => {
    const address = await User.findByIdAndUpdate(req.user._id, { $pull: { addresses: { _id: req.params.id}}}, {new: true}); 
    address || next(new AppError('Error May be user not found', 404))
    !address || res.status(201).json({ message: 'success', Addresses: address.addresses});
}



export const viewAddress = async (req, res, next) => {
    const address = await User.findById(req.user.id); 
    if(!address?.addresses.length){
        return next(new AppError('Error No addresses found', 404)); 
    }
    res.status(200).json({message: 'success', Addresses: address.addresses});
}