import { Product, User } from "../../../db/models/index.js"
import { AppError } from "../../utils/appError.js";


export const addToWishlist = async (req, res, next) => {
    const productToAdd = await Product.findById(req.body.product);

    if(!productToAdd) {
        return next(new AppError('Product not found', 404))
    }

    const wishList = await User.findByIdAndUpdate(req.user._id , {$addToSet: {wishlist: req.body.product}}, {new: true} ); 

    if(!wishList){
        return next(new AppError('wishlist not found', 404))
    }
    res.status(200).json({message: 'Product added to wishlist', wishList: wishList.wishlist}); 

}


export const removeFromWishlist = async (req, res, next) => {
    
    const wishList = await User.findByIdAndUpdate(req.user._id, {$pull: {wishlist : req.body.product}} , {new : true}); 
    if(!wishList){
        return next(new AppError('wishlist or product not found', 404)); 
    }
    res.status(200).json({message: 'Product removed from wishlist', wishList: wishList.wishlist})
}

export const viewWishlist = async (req, res, next) => {
    const wishList = await User.findById(req.user._id);
    if(!wishList?.wishlist.length){
        return next(new AppError('wishlist not found', 404))
    }
    res.status(200).json({message: 'Wishlist', wishList: wishList.wishlist})
}