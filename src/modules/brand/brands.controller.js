import slugify from "slugify"
import { Brand } from "../../../db/models/index.js"
import { AppError } from "../../utils/appError.js";
import { deleteFileByName } from "../../utils/DeleteFile.js";
import { ApiFeature } from "../../utils/apiFeature.js";


export const addBrand = async (req, res, next) =>{
    const slug = slugify(req.body.name);
    const newBrand = new Brand({
        name:req.body.name,
        slug,
        image: req.file.filename,
        createdBy: req.user._id
    })
    await newBrand.save(); 
    res.status(201).json({message:"success" , newBrand});
}


export const getBrands = async (req, res, next) => {
    let ApiFeatures = new ApiFeature(Brand.find(), req.query).pagination().fields().filter().sort().search();

    const brands = await ApiFeatures.mongooseQuery;
    if (!brands) {
        next(new AppError('brands not found', 404))
    }
    res.status(200).json({ message: 'success', brands, page: ApiFeatures.page });
}

export const getBrandByName = async (req, res, next) => {
    const regex = new RegExp(req.params.slug, 'i');
    const brand = await Brand.find({ slug: regex });
    if(!brand){
        next(new AppError('brand Not found' , 404));
    }
    res.status(200).json({ message: 'success', brand });
}


export const updateBrand = async (req,res,next) => {
    const brand = await Brand.findById(req.params.id)
    if(!brand){
        next(new AppError('brand Not found' , 404));
    }
    if(req.body.name){
        const slug = slugify(req.body.name);
        brand.name = req.body.name; 
        brand.slug = slug;
    }
    if(req.file.filename){
        if(brand.image){
            const fileNameToDelete = brand.image.split('/').pop();
            deleteFileByName('../e-comm1/uploads/brands', fileNameToDelete); 
        }
        brand.image = req.file.filename;
    }
    brand.updatedBy = req.user._id; 
    await brand.save();
    res.status(200).json({ message: 'success', brand });
}

export const deleteBrand = (req, res, next) => {
    const brand = Brand.findByIdAndDelete(req.params.id);
    if(!brand){
        next(new AppError('brand Not found' , 404));
    }
    res.status(200).json({ message: 'success' });
}

