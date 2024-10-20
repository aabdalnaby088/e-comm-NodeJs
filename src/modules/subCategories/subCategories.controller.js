import slugify from "slugify"
import { subCategory } from "../../../db/models/index.js";
import { AppError } from "../../utils/appError.js";
import { deleteFileByName } from "../../utils/DeleteFile.js";
import { ApiFeature } from "../../utils/apiFeature.js";

export const addSubCategory = async (req,res,next) => {    
    const slug = slugify(req.body.name)
    req.body.slug = slug; 
    req.body.image = req.file.filename
    const newSubCategory = new subCategory(req.body); 
    newSubCategory.createdBy = req.user._id
    await newSubCategory.save(); 
    res.status(201).json({ message: 'success' , newSubCategory}); 
}

export const getAllSubCategories = async (req,res,next) => {

    let filterById = {}; 
    if (req.params.categoryId) filterById.category = req.params.categoryId; 
    let ApiFeatures = new ApiFeature(subCategory.find(filterById), req.query).pagination().fields().filter().sort().search();

    const subCategories = await ApiFeatures.mongooseQuery;
    if (!subCategories) {
        next(new AppError('subCategories not found', 404))
    }
    res.status(200).json({ message: 'success', subCategories, page: ApiFeatures.page });
}

export const getSubCategoryByName = async (req,res,next) => {
    const regex = new RegExp(req.params.slug, 'i');
    const result = await subCategory.find({
        slug: { $regex: regex }
    })
    if(!result){
        next(new AppError('No subCategory found',404));
    }
    res.status(200).json({message : "success",result});
}

export const updateSubCategory = async (req, res, next) => {
    const {id} = req.params ; 
    const category = req.body.category;
    
    const subCategoryToUpdate = await subCategory.findById(id); 
    if(!subCategoryToUpdate){
        next(new AppError('No subCategory found',404));
    }
    if (req.body.name) {
        const slug = slugify(req.body.name);
        subCategoryToUpdate.name = req.body.name;
        subCategoryToUpdate.slug = slug;
    }
    if(req.file.filename){
        if(subCategoryToUpdate.image){
            
            const fileNameToDelete = subCategoryToUpdate.image.split('/').pop();
            deleteFileByName('../e-comm1/uploads/subCategories', fileNameToDelete); 
        }
        subCategoryToUpdate.image = req.file.filename;
    }
    subCategoryToUpdate.category = category ? category : subCategoryToUpdate.category;
    subCategoryToUpdate.updatedBy = req.user._id
    await subCategoryToUpdate.save(); 
    res.status(200).json({message : "success",subCategoryToUpdate});
}

export const deleteSubCategory = async (req, res, next) => {
    const {id} = req.params ;
    const subCategoryToDelete = await subCategory.findByIdAndDelete(id);
    if(!subCategoryToDelete){
        next(new AppError('No subCategory found',404));
    }
    res.status(200).json({message : "success"});
}

