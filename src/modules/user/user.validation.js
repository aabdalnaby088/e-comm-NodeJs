import Joi from "joi";

export const addUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .required()
        .min(8) 
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%*#?&]+$/, 'password') // Regex pattern
        .messages({
            'string.pattern.name': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'string.min': 'Password must be at least 8 characters long.'
        }),
    rePassword: Joi.string()
        .valid(Joi.ref('password')) // Ensure it matches the password
        .required()
        .messages({
            'any.only': 'Re-entered password must match the original password.',
            'string.empty': 'Re-entered password is required.'
        }) ,
    role: Joi.string().valid("admin", "user"),
})

export const updateUserValidation = Joi.object({
    id: Joi.string().hex().length(24),
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string()
        
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%*#?&]+$/, 'password') // Regex pattern
        .messages({
            'string.pattern.name': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'string.min': 'Password must be at least 8 characters long.'
        }),
    role: Joi.string().valid("admin", "user"),
})
