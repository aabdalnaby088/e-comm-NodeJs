import { Router } from "express";
import { checkEmail } from "../../utils/checkEmail.js";
import { catchError } from "../../middlewares/catchError.js";
import { protectedRoutes, signIn, signUp, updatePassword } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import { signInValidation, signUpValidation } from "./auth.validation.js";


export const authRouter = Router(); 

authRouter.post('/signup', checkEmail, validate(signUpValidation), catchError(signUp)); 

authRouter.post('/signin', validate(signInValidation), catchError(signIn)); 

authRouter.put('/updatePass' , protectedRoutes, catchError(updatePassword))