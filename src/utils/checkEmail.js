import { User } from "../../db/models/index.js";
import { AppError } from "./appError.js";

export const checkEmail = async (req, res, next) => {
    const { email } = req.body;
    let isExists = await User.findOne({email}); 
    if(isExists) return next(new AppError('email already exist', 409 )); 
    next()
}