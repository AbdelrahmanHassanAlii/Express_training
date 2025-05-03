/* eslint-disable node/no-unsupported-features/es-syntax */
const ReviewModel = require("../models/reviewModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { sendResponse } = require("../utils/response");
const { deleteOne } = require("./handlerFactory");


// get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await ReviewModel.find();
    sendResponse(res, 200, "All reviews", reviews, { count: reviews.length });
})

// get all reviews about specific tour id
exports.getTourReviews = catchAsync(async (req, res, next) => {
    const reviews = await ReviewModel.find({ tour: req.params.tourId });
    if (!reviews) {
        return next(new AppError('No reviews found for this tour', 404));
    }
    sendResponse(res, 200, "All reviews for this tour", reviews, { count: reviews.length });
});

// get review by id
exports.getReview = catchAsync(async (req, res, next) => {
    const review = await ReviewModel.findById(req.params.id);
    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }
    sendResponse(res, 200, "Review details", review);
});

// create review route
exports.createReview = catchAsync(async (req, res, next) => {
    const newReview = await ReviewModel.create({
        tour: req.params.tourId,
        user: req.user.id,
        review: req.body.review,
        rate: req.body.rate
    });
    sendResponse(res, 201, "Review created", newReview);
});

exports.deleteReview = deleteOne(ReviewModel);