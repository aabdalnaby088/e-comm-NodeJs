import { Router } from "express";
import { addSubCategory, getAllSubCategories, getSubCategoryByName, updateSubCategory } from "./subCategories.controller.js";
import { catchError } from "../../middlewares/catchError.js";
import { deleteCategory } from "../category/category.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { allowedTo, protectedRoutes } from "../Auth/auth.controller.js";


export const subCategoriesRouter = Router({ mergeParams: true } );

subCategoriesRouter.post('/create', protectedRoutes, allowedTo('admin'), uploadSingleFile('image', 'subCategories'), catchError(addSubCategory));
subCategoriesRouter.get('/list' , catchError(getAllSubCategories)); 
subCategoriesRouter.get('/list/:name' , catchError(getSubCategoryByName));  
subCategoriesRouter.put('/update/:id', protectedRoutes, allowedTo('admin'), uploadSingleFile('image', 'subCategories'), catchError(updateSubCategory)); 
subCategoriesRouter.delete('/delete/:id', protectedRoutes, allowedTo('admin'), catchError(deleteCategory)); 