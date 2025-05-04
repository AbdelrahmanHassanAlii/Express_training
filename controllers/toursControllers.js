/* eslint-disable node/no-unsupported-features/es-syntax */
const TourModel = require("../models/tourModel");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { sendResponse } = require("../utils/response");
const { deleteOne, updateOne } = require("./handlerFactory");

// custom routes
exports.get2Cheapest = async (req, res, next) => {
    req.query.limit = 2;
    req.query.page = 1;
    req.query.sort = '-raitingAverage price';
    req.query.fields = 'name price duration';
    next();
}
// products routes Controller
exports.getTours = catchAsync(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(TourModel.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // await the query
    const tours = await apiFeatures.query;

    // return the response
    sendResponse(res, 200, 'All tours', tours, { total: tours.length, requestedAt: req.requestTime });
})

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await TourModel.findById(req.params.id).populate('reviews');
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    sendResponse(res, 200, 'Tour details', tour);
})

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await TourModel.create(req.validatedBody);
    sendResponse(res, 201, 'Tour created', newTour);
})

exports.updateTour = updateOne(TourModel)

exports.deleteTour = deleteOne(TourModel);

exports.tourStats = catchAsync(async (req, res, next) => {
    const stats = await TourModel.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numberOfTours: { $sum: 1 },
                avgPrice: { $avg: '$price' },
                avgRatings: { $avg: '$ratingsAverage' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ])
    sendResponse(res, 200, 'Tour stats', stats, { total: stats.length, requestedAt: req.requestTime });
})

exports.getMonthlyPlans = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plans = await TourModel.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: { startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numberOfTours: { $sum: 1 },
                tours: { $push: '$name' },
                avgPrice: { $avg: '$price' }
            }
        },
        {
            $sort: { _id: 1 }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: { _id: 0 }
        }
    ])
    sendResponse(res, 200, 'Tour monthly plans', plans, { total: plans.length, requestedAt: req.requestTime });
})