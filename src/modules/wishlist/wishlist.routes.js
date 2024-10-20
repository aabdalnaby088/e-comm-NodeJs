import { Router } from "express";
import { allowedTo, protectedRoutes } from "../Auth/auth.controller.js";
import { catchError } from "../../middlewares/catchError.js";
import { addToWishlist, removeFromWishlist, viewWishlist } from "./wishlist.controller.js";


export const wishlistRouter = Router(); 

wishlistRouter.patch('/add',protectedRoutes, allowedTo('user'), catchError(addToWishlist))

wishlistRouter.delete('/remove',protectedRoutes, allowedTo('user'), catchError(removeFromWishlist))

wishlistRouter.get('/list', protectedRoutes, allowedTo('user'), catchError(viewWishlist)); 