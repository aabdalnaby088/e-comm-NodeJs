import { Router } from "express";
import { allowedTo, protectedRoutes } from "../Auth/auth.controller.js";
import { catchError } from "../../middlewares/catchError.js";
import { cancelOrder, createCashOrder, createCheckoutSession } from "./order.controller.js";


export const orderRouter = Router()

orderRouter.post('/create/:id', protectedRoutes, allowedTo('user'), catchError(createCashOrder))
orderRouter.put('/cancel/:id', protectedRoutes, allowedTo('user'), catchError(cancelOrder));
orderRouter.post('/checkout/:id', protectedRoutes, allowedTo('user'), catchError(createCheckoutSession)); 