import { Router } from "express";
import { catchError } from "../../middlewares/catchError.js";
import { addBrand, deleteBrand, getBrandByName, getBrands, updateBrand } from "./brands.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { allowedTo, protectedRoutes } from "../Auth/auth.controller.js";


export const brandsRouter = Router();  

brandsRouter.post('/create', protectedRoutes, allowedTo('admin'), uploadSingleFile('image' , 'brands'),catchError(addBrand));
brandsRouter.get('/list' , catchError(getBrands)); 
brandsRouter.get('/list/:slug', catchError(getBrandByName));
brandsRouter.put('/update/:id', protectedRoutes, allowedTo('admin'), uploadSingleFile('image', 'brands'), catchError(updateBrand)); 
brandsRouter.delete('/delete/:id', protectedRoutes, allowedTo('admin'), catchError(deleteBrand));



