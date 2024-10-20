import { Router } from "express";
import { addCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "./category.controller.js";
import { catchError } from "../../middlewares/catchError.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { validate } from "../../middlewares/validate.js";
import { addCategorySchema, updateCategorySchema } from "./category.validation.js";
import { subCategoriesRouter } from "../subCategories/subCategories.routes.js";
import { allowedTo, protectedRoutes } from "../Auth/auth.controller.js";


export const categoryRouter = Router() ;
categoryRouter.use('/:categoryId/subcategories' , subCategoriesRouter); 
categoryRouter.route('/create').post(protectedRoutes, allowedTo('admin'), uploadSingleFile('image', 'categories'), validate(addCategorySchema), catchError(addCategory)); 
categoryRouter.route('/list').get(catchError(getAllCategories)) ; 
categoryRouter.route('/get/:slug').get(catchError(getCategory)) ;
categoryRouter.route('/update/:id').put(protectedRoutes, allowedTo('admin'), uploadSingleFile('image', 'categories'), validate(updateCategorySchema), catchError(updateCategory)); 
categoryRouter.route('/delete/:id').delete(protectedRoutes, allowedTo('admin'), catchError(deleteCategory)); 
