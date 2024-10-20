import { AppError } from "../utils/appError.js";


export const validate = (schema) => {
    return async (req, res, next) => {
        let imageValue = undefined;
        let imageKey = undefined;

        if (req.file || req.files) {
            imageKey = req.files ? 'images' : 'image';
            imageValue = req.files ? req.files.images : req.file; 
        }

        const dataToValidate = { ...req.body, ...req.params, ...req.query };

        if (imageKey) {
            dataToValidate[imageKey] = imageValue;
        }

        const { error } = schema.validate(dataToValidate, { abortEarly: false });

        if (!error) {
            next();
        } else {
            const errMsg = error.details.map(err => err.message);
            next(new AppError(errMsg, 400));
        }
    }
}