import slugify from "slugify";
import { Category } from "../../../db/models/category.model.js"
import { AppError } from "../../utils/appError.js";
import { deleteFileByName } from "../../utils/DeleteFile.js";
import { ApiFeature } from "../../utils/apiFeature.js";

export const addCategory = async (req,res,next) => {  
    req.body.slug = slugify(req.body.name , '-'); 
    req.body.image = req.file.filename
    let newCategory = new Category(req.body);
    newCategory.createdBy = req.user._id; 
    await newCategory.save(); 
    res.status(201).json({message: "success" , newCategory}); 
}

export const getAllCategories = async (req,res,next) => {
    let ApiFeatures = new ApiFeature(Category.find(), req.query).pagination().fields().filter().sort().search();

    const categories = await ApiFeatures.mongooseQuery;
    if (!categories) {
        next(new AppError('categories not found', 404))
    }
    res.status(200).json({ message: 'success', categories, page: ApiFeatures.page });
}

export const getCategory = async (req,res,next) => {
    const regex = new RegExp(req.params.slug, 'i');
    const category = await Category.find({
        slug: { $regex: regex }
    });
    if (!category) return next(new AppError("category not found", 404));
    res.status(200).json({message: 'success' , category});
}

export const updateCategory = async (req,res,next) => {
    const {id} = req.params; 
    
    const categoryToUpdate = await Category.findById(id); 
    if (!categoryToUpdate) return next(new AppError("category not found", 404));
    if(req.file.filename){
        if(categoryToUpdate.image){
            const fileNameToDelete = categoryToUpdate.image.split('/').pop(); 
            deleteFileByName('../e-comm1/uploads/categories', fileNameToDelete); 
        }
        categoryToUpdate.image = req.file.filename
    }
    if(req.body.name){
        categoryToUpdate.name = req.body.name;
        const slug = slugify(req.body.name , '-') ; 
        categoryToUpdate.slug = slug
    }
    categoryToUpdate.updatedBy= req.user._id; 
    await categoryToUpdate.save(); 
    res.status(201).json({ message: 'success', categoryToUpdate });
}

export const deleteCategory = async (req, res ,next) => {
    const {id} = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return next(new AppError("category not found", 404));
    res.status(200).json({message : 'success'})
}







