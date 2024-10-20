import Joi from "joi"

export const createReviewSchema = Joi.object({
    rate: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().min(10).max(50000),
    product: Joi.string().hex().length(24).required()
})
