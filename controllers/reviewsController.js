/* eslint-disable node/no-unsupported-features/es-syntax */
const ReviewModel = require("../models/reviewModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { sendResponse } = require("../utils/response");
const { deleteOne, updateOne, createOne, getOne } = require("./handlerFactory");


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
exports.getReview = getOne(ReviewModel, [
    { path: 'tour', select: 'name price priceDiscount duration -guides' },
    { path: 'user', select: 'name' }
    ])

// create review route
exports.createReview = createOne(ReviewModel, (req) => ({ tour: req.params.tourId, user: req.user.id }));

exports.updateReview = updateOne(ReviewModel);

exports.deleteReview = deleteOne(ReviewModel);