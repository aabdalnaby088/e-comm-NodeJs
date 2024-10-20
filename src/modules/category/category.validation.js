import Joi from "joi";

export const addCategorySchema = Joi.object({
    name:Joi.string().required().min(1),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding:Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
        size: Joi.number().max(5242880).required(), 
        destination: Joi.string().required(), 
        filename: Joi.string().required(),
        path: Joi.string().required()
    }).required()
})

export const updateCategorySchema = Joi.object({
    id:Joi.string().hex().length(24),
    name: Joi.string().min(1),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
        size: Joi.number().max(5242880).required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required()
    })
})