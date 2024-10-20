import { Review } from "../../../db/models/index.js";
import { AppError } from "../../utils/appError.js";


export const addReview = async (req, res, next) => {
    const reviewAlreadyAdded = Review.findOne({
        user: req.user._id, 
        product: req.body.product
    })
    if(reviewAlreadyAdded){ 
        return next(new AppError("You have already added a review for this product", 409))
    }
    const newReview = new Review({
        rate: req.body.rate,
        comment: req.body.comment,
        product: req.body.product,
        user: req.user._id
    })
    await newReview.save();
    res.status(201).json({ message: "success", newReview });
}


export const getReviews = async (req, res, next) => {

    const reviews = await Review.find({
        product: req.params.productId
    });
    if (!reviews) {
        next(new AppError('reviews not found', 404))
    }
    res.status(200).json({ message: 'success', reviews });
}


export const updateReview = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId)
    if(req.user._id != review.user){
        return next(new AppError("You are not the owner of this review", 403))
    }
    if (!review) {
        next(new AppError('review Not found', 404));
    }
    if (req.body.comment) {
        review.comment = req.body.comment;
    }
    if (req.body.rate) {
        review.rate = req.body.rate;
    }
    
    await review.save();
    res.status(200).json({ message: 'success', review });
}

export const deleteReview = (req, res, next) => {
    const review = Review.findByIdAndDelete(req.params.reviewId);
    if (!review) {
        next(new AppError('brand Not found', 404));
    }
    res.status(200).json({ message: 'success' });
}
