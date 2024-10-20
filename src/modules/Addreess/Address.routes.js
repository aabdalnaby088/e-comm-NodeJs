import { Router } from "express";
import { allowedTo, protectedRoutes } from "../Auth/auth.controller.js";
import { catchError } from "../../middlewares/catchError.js";
import { addAddress, removeAddress, viewAddress } from "./Address.controller.js";



export const addressRouter = Router(); 


addressRouter.patch('/add', protectedRoutes, allowedTo('user'), catchError(addAddress)); 

addressRouter.delete('/remove/:id', protectedRoutes, allowedTo('user'), catchError(removeAddress)); 

addressRouter.get('/list', protectedRoutes, allowedTo('user'), catchError(viewAddress)); 