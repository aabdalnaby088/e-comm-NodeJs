import Joi from "joi"

export const addCouponSchema = Joi.object({
    couponCode: Joi.string().required(),
    discountAmount: Joi.number().when('couponType', {
        is: Joi.string().valid("percentage"),
        then: Joi.number().max(100),
    }).min(1).required(),
    discountType: Joi.string().valid("percentage", "fixed").required(),
    expiryDate: Joi.date().greater(new Date()).required(),
})


export const updateCouponSchema = Joi.object({
    id: Joi.string().hex().length(24).required(), 
    couponCode: Joi.string(),
    discountAmount: Joi.number().when('couponType', {
        is: Joi.string().valid("percentage"),
        then: Joi.number().max(100),
    }).min(1),
    discountType: Joi.string().valid("percentage", "fixed"),
    expiryDate: Joi.date().greater(new Date()),
})