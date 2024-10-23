import { catchError } from "../middlewares/catchError.js";
import { addressRouter } from "./Addreess/Address.routes.js";
import { authRouter } from "./Auth/auth.routes.js";
import { brandsRouter } from "./brand/brands.routes.js";
import { cartRouter } from "./cart/cart.routes.js";
import { categoryRouter } from "./category/category.routes.js"
import { couponRouter } from "./coupon/coupon.routes.js";
import { payByCard } from "./order/order.controller.js";
import { orderRouter } from "./order/order.routes.js";
import { productsRouter } from "./product/product.routes.js";
import { reviewRouter } from "./reviews/reveiw.routes.js";
import { subCategoriesRouter } from "./subCategories/subCategories.routes.js";
import { userRouter } from "./user/user.routes.js";
import { wishlistRouter } from "./wishlist/wishlist.routes.js";
import express from "express"
export const bootstrap = (app) => {
    app.use('/api/categories' , categoryRouter); 
    app.use('/api/subCategories' , subCategoriesRouter);
    app.use('/api/brands' , brandsRouter); 
    app.use('/api/products', productsRouter);
    app.use('/api/users', userRouter); 
    app.use('/api/auth', authRouter);
    app.use('/api/reviews', reviewRouter)
    app.use('/api/wishlist', wishlistRouter);
    app.use('/api/addresses', addressRouter); 
    app.use('/api/coupons', couponRouter); 
    app.use('/api/carts', cartRouter);
    app.use('/api/orders', orderRouter);
    app.post('/api/webhook', express.raw({ type: 'application/json' }), catchError(payByCard));
}