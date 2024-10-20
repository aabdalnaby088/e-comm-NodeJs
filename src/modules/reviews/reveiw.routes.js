import { Router } from "express";
import { allowedTo, protectedRoutes } from "../Auth/auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createReviewSchema } from "./review.validation.js";
import { catchError } from "../../middlewares/catchError.js";
import { addReview, deleteReview, getReviews, updateReview } from "./review.controller.js";


export const reviewRouter = Router(); 

reviewRouter.post('/create' , protectedRoutes, allowedTo('user'), validate(createReviewSchema), catchError(addReview)); 


reviewRouter.get('/list/:productId', catchError(getReviews)); 


reviewRouter.put('/update/:reviewId' , protectedRoutes, allowedTo('user'), catchError(updateReview)); 

reviewRouter.delete('/delete/:reviewId', protectedRoutes, allowedTo('user, admin'), catchError(deleteReview)); 

