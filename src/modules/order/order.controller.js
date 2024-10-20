import { Cart, Order, Product, User } from "../../../db/models/index.js"
import { AppError } from "../../utils/appError.js";
import Stripe from 'stripe';
import { config } from "dotenv";
config()

const stripe = new Stripe(process.env.SECRET_KEY);


export const createCashOrder = async (req, res, next) => {
    const user = User.findById(req.user._id);
    if (user.isBlocked){
        return next ( new AppError( "you can't create cash order", 400)); 
    }
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
        return next(new AppError("cart not found", 404))
    }
    const order = await Order.create({
        user: req.user._id,
        orderItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        totalOrderPrice: cart.totalCartPriceAfterDiscount
    })
    await order.save(); 
    // cart.cartItems.forEach(async (product, idx)=> {
    //     let myProduct = await Product.findByIdAndUpdate(product.product, {
    //         $inc: { stock: product.quantity*-1 },
    //         $inc: { sold: product.quantity*1 },
    //     })
    // })
    const options = cart.cartItems.map(product=> {
        return ({
            updateOne: {
                "filter": { _id: product.product}, 
                "update": { $inc: {sold: 1*product.quantity, stock: -1*product.quantity}}
            }
        })
    })
    await Product.bulkWrite(options)
    await Cart.findByIdAndDelete(cart._id); 
    res.status(200).json({message: 'success', order});
}


export const cancelOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new AppError("order not found", 404))
    }
    if (order.orderStatus !== "pending") {
        return next( new AppError("can't cancel this order", 400))
    }
    let user = await User.findById(req.user._id); 
    if (user.isBlocked){
        return next ( new AppError( "you can't cancel this order", 400));
    }
    order.orderStatus = "cancelled";
    await order.save();
    user.isBlocked= true; 
    await user.save();
    res.status(200).json({message: 'success', order});
}

export const createCheckoutSession = async (req, res, next) => {
    let cart = await Cart.findById(req.params.id); 
    if (!cart) {
        return next(new AppError("cart not found", 404))
    }
    let session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data:{
                    currency: 'egp',
                    unit_amount: cart.totalCartPriceAfterDiscount * 100,
                    product_data:{
                        name: req.user.name,
                    }
                } ,
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url:"https://www.youtube.com/playlist?list=PLCInYL3l2AagY7fFlhCrjpLiIFybW3yQv",
        cancel_url:"https://docs.stripe.com/keys",
        customer_email: req.user.email,
        client_reference_id:req.params.id,
    })
    
    res.status(200).json({ message: "success", session });
}

