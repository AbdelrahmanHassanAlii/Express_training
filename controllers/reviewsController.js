/* eslint-disable node/no-unsupported-features/es-syntax */
const ReviewModel = require("../models/reviewModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { sendResponse } = require("../utils/response");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlerFactory");


// get all reviews
exports.getAllReviews = getAll(ReviewModel)

exports.getTourReviews = getAll(ReviewModel, { tour: (req) => req.params.tourId });
// get review by id
exports.getReview = getOne(ReviewModel, [
    { path: 'tour', select: 'name price priceDiscount duration -guides' },
    { path: 'user', select: 'name' }
    ])

// create review route
exports.createReview = createOne(ReviewModel, (req) => ({ tour: req.params.tourId, user: req.user.id }));

exports.updateReview = updateOne(ReviewModel);

exports.deleteReview = deleteOne(ReviewModel);