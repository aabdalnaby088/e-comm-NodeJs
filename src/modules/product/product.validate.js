import Joi from "joi";

export const addProductSchema = Joi.object({
name : Joi.string().min(1).max(1000).required(), 
    images: Joi.array().items(
        Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
            size: Joi.number().max(5242880).required(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required()
        })
    ).required(), 
price: Joi.number().required(), 
priceAfterDiscount: Joi.number(),
desc: Joi.string().min(10).max(30000).required(),
sold : Joi.number(), 
stock: Joi.number().min(0).required(),
category: Joi.string().hex().length(24).required(), 
subCategory: Joi.string().hex().length(24).required(), 
brand: Joi.string().hex().length(24).required(),
rateAvg: Joi.number(),
rateCount: Joi.number()
})


export const updateProductSchema = Joi.object({
    name: Joi.string().min(1).max(1000),
    images: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
        size: Joi.number().max(5242880).required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required()
    }),
    price: Joi.number(),
    priceAfterDiscount: Joi.number(),
    desc: Joi.string().min(10).max(30000),
    sold: Joi.number(),
    stock: Joi.number().min(0),
    category: Joi.string().hex().length(24),
    subCategory: Joi.string().hex().length(24),
    brand: Joi.string().hex().length(24),
    rateAvg: Joi.number(),
    rateCount: Joi.number()
})