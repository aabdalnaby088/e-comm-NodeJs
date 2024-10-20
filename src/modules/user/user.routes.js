import { Router } from "express";
import { addUser, deleteUser, getAllUsers, getUser, updateUser } from "./user.controller.js";
import { validate } from "../../middlewares/validate.js";
import { addUserSchema, updateUserValidation } from "./user.validation.js";
import { catchError } from "../../middlewares/catchError.js";
import { checkEmail } from "../../utils/checkEmail.js";


export const userRouter = Router(); 

userRouter.post('/create', checkEmail, validate(addUserSchema) , catchError(addUser));

userRouter.get('/list', catchError(getAllUsers)); 

userRouter.get('/list/:id' , catchError(getUser)); 

userRouter.put('/update/:id', validate(updateUserValidation) , catchError(updateUser)); 

userRouter.delete('/delete/:id' , catchError(deleteUser))

