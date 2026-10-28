import Review from './../models/reviewModel.js';
import {getOne, getAll, createOne, updateOne, deleteOne} from './handlerFactory.js';
import AppError from "../utils/appError.js";
import {createReviewValidation, updateReviewValidation} from "../validations/reviewValidation.js";
import catchAsync from "../utils/catchAsync.js";

export const setMovieUserIds = (req, res, next) => {
    if (!req.body.tmdbId) req.body.tmdbId = req.params.tmdbId;
    if (!req.body.user) req.body.user = req.user.id;

    next();
};


export const checkReviewOwnership = catchAsync(async (req, res, next) => {
    const review = await Review.findOne({
        tmdbId: req.params.tmdbId,
        user: req.user.id,
    }).select("_id");

    if (!review) {
        return next(new AppError("Review not found.", 404));
    }

    req.params.id = review._id.toString();

    next();
});


export const setReviewId = async (req, res, next) => {
    const review = await Review.findOne({
        tmdbId: req.params.tmdbId,
        user: req.user.id,
    });

    if (!review) {
        return next(new AppError("Review not found.", 404));
    }

    req.params.id = review._id;
    next();
};

export const setTmdbId = async (req, res, next) => {
    req.query.tmdbId = req.params.tmdbId;

    next();
}

export const setUserId = async (req, res, next) => {
    req.query.user = req.user.id;

    next();
}

export const getReview = getOne(Review, [{path: 'user'}]);
export const getAllReviews = getAll(Review);
export const createReview = createOne(Review, createReviewValidation);
export const updateReview = updateOne(Review, updateReviewValidation);
export const deleteReview = deleteOne(Review);
