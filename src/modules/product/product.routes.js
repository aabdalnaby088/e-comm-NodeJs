import { Router } from "express";
import { catchError } from "../../middlewares/catchError.js";
import { addProduct, deleteProduct, getAllProducts, getProductByName, updateProduct } from "./product.controller.js";
import { uploadMixOfFiles } from "../../fileUpload/fileUpload.js";
import { validate } from "../../middlewares/validate.js";
import { addProductSchema } from "./product.validate.js";
import { allowedTo, protectedRoutes } from "../Auth/auth.controller.js";


export const productsRouter = Router(); 

productsRouter.post('/create', protectedRoutes, allowedTo('admin'), uploadMixOfFiles([{name:'imageCover' , maxCount:1}, {name:'images' , maxCount:5}] , 'products'), validate(addProductSchema), catchError(addProduct)); 

productsRouter.get('/list' , catchError(getAllProducts)); 

productsRouter.get('/list/:name' , catchError(getProductByName)); 

productsRouter.put('/update/:id', protectedRoutes, allowedTo('admin'), uploadMixOfFiles([{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 5 }], 'products'), catchError(updateProduct)); 

productsRouter.delete('/delete/:id', protectedRoutes, allowedTo('admin'), catchError(deleteProduct)); 