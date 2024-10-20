import slugify from "slugify";
import { Product } from "../../../db/models/index.js";
import { AppError } from "../../utils/appError.js";
import { deleteFileByName } from "../../utils/DeleteFile.js";
import { ApiFeature } from "../../utils/apiFeature.js";


export const addProduct = async (req, res, next) => {
    
    const { name, price, priceAfterDiscount, desc, stock, sold, category, subCategory, brand, rateAvg, rateCount} = req.body
    let productObj = {} ; 
    const slug = slugify(name, '-'); 
    productObj.name = name;
    productObj.slug = slug;
    productObj.price = price;
    productObj.desc = desc; 
    productObj.stock = stock;
    productObj.category = category;
    productObj.subCategory = subCategory;
    productObj.brand = brand;
    productObj.imageCover = req.files.imageCover[0].filename;
    productObj.images = req.files.images.map(file => file.filename); 
    if(priceAfterDiscount){
        productObj.priceAfterDiscount = priceAfterDiscount;
    }if(rateAvg){
        productObj.rateAvg = rateAvg;
    }if(rateCount){
        productObj.rateCount = rateCount;
    }if(sold){
        productObj.sold = sold;
    }
    const newProduct = new Product(productObj);
    newProduct.createdBy = req.user._id
    await newProduct.save(); 
    res.status(201).json({message : "success" , newProduct});
}


export const getAllProducts = async (req, res, next) => {
    let ApiFeatures = new ApiFeature(Product.find(), req.query).pagination().fields().filter().sort().search();
    
    const products = await ApiFeatures.mongooseQuery; 
    if(!products){
        next(new AppError('Products not found' , 404))
    }
    res.status(200).json({ message: 'success' , products , page: ApiFeatures.page});
}

export const getProductByName = async (req, res, next) => {
    const regex = new RegExp(req.params.name, 'i');
    const product = await Product.find({ slug: { $regex: regex } });
    
    if(!product){
        next(new AppError('Product not found' , 404));
    }
    res.status(200).json({ message: 'success' , product});
}

export const updateProduct = async (req, res, next) => {
    const {id} = req.params; 
    let productToBeUpdated = await Product.findById(id); 
    if(!productToBeUpdated){
        next(new AppError('Product not found' , 404));
    }
    const { name, price, priceAfterDiscount, desc, stock, sold, category, subCategory, brand, rateAvg, rateCount } = req.body
    if (name) {
        const slug = slugify(name, '-');
        productToBeUpdated.slug = slug;
        productToBeUpdated.name = name;
    }
    if (price) {
        productToBeUpdated.price = price;
    }
    if (priceAfterDiscount) {
        productToBeUpdated.priceAfterDiscount = priceAfterDiscount;
    }
    if (desc) {
        productToBeUpdated.desc = desc;
    }
    if (stock) {
        productToBeUpdated.stock = stock;
    }
    if (sold) {
        productToBeUpdated.sold = sold;
    }
    if (category) {
        productToBeUpdated.category = category;
    }
    if (subCategory) {
        productToBeUpdated.subCategory = subCategory;
    }
    if (brand) {
        productToBeUpdated.brand = brand;
    }
    if (rateAvg) {
        productToBeUpdated.rateAvg = rateAvg;
    }
    if (rateCount) {
        productToBeUpdated.rateCount = rateCount;
    }
    if (req.files.imageCover[0].filename){
        
        const fileNameToDelete = productToBeUpdated.imageCover.split('/').pop();
        deleteFileByName('../e-comm1/uploads/products', fileNameToDelete); 
        productToBeUpdated.imageCover = req.files.imageCover[0].filename;
    }
    if(req.files.images){
        
        if(productToBeUpdated.images.length){
            productToBeUpdated.images.forEach(image => {
                const fileNameToDelete = image.split('/').pop(); 
                deleteFileByName('../e-comm1/uploads/products', fileNameToDelete);
            });
        }
        productToBeUpdated.images = req.files.images.map(file => file.filename); 
    }
        productToBeUpdated.updatedBy = req.user._id
        await productToBeUpdated.save();
        res.status(200).json({ message: 'success' , productToBeUpdated});
    }


export const deleteProduct = async (req, res, next) => {
    const {id} = req.params;
    const productToDelete = await Product.findByIdAndDelete(id);
    if(!productToDelete){
        next(new AppError('Product not found', 404))
    }
    res.status(200).json({ message: 'success'});

}