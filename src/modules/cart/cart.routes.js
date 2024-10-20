import { Router } from "express";
import { allowedTo, protectedRoutes } from "../Auth/auth.controller.js";
import { applyCoupon, clearCart, createCart, getLoggedUserCart, removeProduct, updateQuantity } from "./cart.controller.js";
import { catchError } from "../../middlewares/catchError.js";


export const cartRouter = Router(); 

cartRouter.post('/create', protectedRoutes, allowedTo('user'), catchError(createCart)); 
cartRouter.put('/update/:id', protectedRoutes, allowedTo('user'), catchError(updateQuantity));
cartRouter.patch('/removeItem/:id', protectedRoutes, allowedTo('user'), catchError(removeProduct));
cartRouter.get('/getCart', protectedRoutes, allowedTo('user'), catchError(getLoggedUserCart));
cartRouter.delete('/clear', protectedRoutes, allowedTo('user'), catchError(clearCart))
cartRouter.put('/applyCoupon', protectedRoutes, allowedTo('user'), catchError(applyCoupon))

