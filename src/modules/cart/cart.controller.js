import { Cart, Coupon, Product } from "../../../db/models/index.js"
import { AppError } from "../../utils/appError.js";
import { calcTotal } from "../../utils/calculateTotal.js";


export const createCart = async (req, res, next) => {
    let isCartExist = await Cart.findOne({ user: req.user._id });
    let product = await Product.findById(req.body.product);
    let ProductAlreadyInCart = null;
    if (isCartExist)
        ProductAlreadyInCart = isCartExist.cartItems.find(item => item.product == req.body.product);
    
    // check product
    if (!product) {
        return next(new AppError("Product not found", 404));
    }
    req.body.price = product.priceAfterDiscount ? product.priceAfterDiscount : product.price;
    //check quantity if product first time to add to the cart 
    if (req.body.quantity > product.stock) {
        return next(new AppError(`Quantity exceeds stock only we have ${product.stock}`, 400));
    }
    //check quantity if product exist in the cart 
    if (ProductAlreadyInCart?.quantity + req.body.quantity > product.stock) {
        return next(new AppError(`Quantity exceeds stock only we have ${product.stock}`, 400));
    }
    // if cart not exist create one else, add to the exist one 
    if (!isCartExist) {
        let cart = new Cart({
            user: req.user._id,
            cartItems: [req.body]
        })
        const { total, totalAfterDiscount } = calcTotal(cart.cartItems);

        cart.total = total;
        cart.totalCartPriceAfterDiscount = totalAfterDiscount
        await cart.save()
        res.status(201).json({ message: 'Success', cart });
    } else {
        if (ProductAlreadyInCart) {
            ProductAlreadyInCart.quantity += req.body.quantity || 1;
        } else {
            isCartExist.cartItems.push(req.body);
        }
        const { total, totalAfterDiscount } = calcTotal(isCartExist.cartItems);
        isCartExist.total = total;
        isCartExist.totalCartPriceAfterDiscount = totalAfterDiscount
        await isCartExist.save();
        res.status(200).json({ message: 'Success', cart: isCartExist });
    }
}


export const updateQuantity = async (req, res, next) => {
    let isCartExist = await Cart.findOne({ user: req.user._id });
    if (!isCartExist) {
        return next(new AppError("Cart not found", 404));
    }
    const item = isCartExist.cartItems.find(item => item.product == req.params.id);
    if (!item) {
        return next(new AppError("Add the product to the cart first", 404));
    }
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new AppError("Product not found", 404));
    }
    if (req.body.quantity > product.stock) {
        return next(new AppError(`Quantity exceeds stock only we have ${product.stock}`, 400));
    }
    item.quantity = req.body.quantity;
    const { total, totalAfterDiscount } = calcTotal(isCartExist.cartItems);
    isCartExist.total = total
    isCartExist.totalCartPriceAfterDiscount = totalAfterDiscount
    await isCartExist.save();
    res.status(200).json({ message: 'Success', cart: isCartExist });
}


export const removeProduct = async (req, res, next) => {
    let item = await Cart.findOneAndUpdate({user: req.user._id}, {
        $pull: { cartItems: { _id: req.params.id } }
    }, { new: true })
    console.log(item);
    
    if (!item) {
        return next(new AppError("Cart not found", 404));
    }
    if (item?.cartItems?.length == 0){
        await Cart.findByIdAndDelete(item._id);
        res.status(200).json({message: 'Your cart is now empty!'}); 
    }
    const { total, totalAfterDiscount } = calcTotal(item.cartItems);
    item.total = total
    item.totalCartPriceAfterDiscount = totalAfterDiscount
    await item.save()
    res.status(200).json({ message: 'Success', cart: item });
}


export const getLoggedUserCart = async (req, res, next) =>{
    const cart = await Cart.findOne({user: req.user._id});
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    res.status(200).json({ message: 'success', cart: cart });
}



export const clearCart = async (req, res, next) => {
    const cart = await Cart.findOneAndDelete({user: req.user._id});
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    res.status(200).json({ message: 'success'});
}

export const applyCoupon = async (req, res, next) => {
    const cart = await Cart.findOne({user: req.user._id});
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    const coupon = await Coupon.findOne({ couponCode: req.body.code});
    if(!coupon){
        return next(new AppError("Invalid coupon code", 404));
    }
    if (coupon.expiryDate < Date.now()){
        return next(new AppError("Coupon has expired", 404));
    }
    if(cart.discount){
        return next(new AppError("You have active coupon", 409));
    }
    if(coupon.discountType == 'fixed'){
        if(coupon.discountAmount <= cart.total){
            cart.totalCartPriceAfterDiscount = cart.total - coupon.discountAmount;
            cart.discount = coupon.discountAmount+'EGP'; 
            req.status(200).json({message: "success", cart});
        }else{
            return next(new AppError("Can't apply this coupon here!", 404));
        }
    }
    const { total, totalAfterDiscount } = calcTotal(cart.cartItems, coupon.discountAmount); 
    cart.total = total
    cart.totalCartPriceAfterDiscount = totalAfterDiscount
    cart.discount = coupon.discountAmount + '%';
    await cart.save()
    res.status(200).json({ message: 'success', cart: cart });
}