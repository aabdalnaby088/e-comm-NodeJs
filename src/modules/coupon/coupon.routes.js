import { Router } from "express";
import { allowedTo, protectedRoutes } from "../Auth/auth.controller.js";
import { catchError } from "../../middlewares/catchError.js";
import { addCoupon, getCoupons, removeCoupon, updateCoupon } from "./coupon.controller.js";
import { validate } from "../../middlewares/validate.js";
import { addCouponSchema, updateCouponSchema } from "./coupon.validation.js";



export const couponRouter = Router(); 

couponRouter.use(protectedRoutes, allowedTo('admin'));

couponRouter.post('/add', validate(addCouponSchema), catchError(addCoupon)); 

couponRouter.put('/update/:id', validate(updateCouponSchema), catchError(updateCoupon)); 

couponRouter.delete('/remove/:id', catchError(removeCoupon)); 

couponRouter.get('/list', catchError(getCoupons)); 