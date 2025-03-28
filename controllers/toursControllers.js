/* eslint-disable node/no-unsupported-features/es-syntax */
const TourModel = require("../models/tourModel");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

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
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        total: tours.length,
        tours,
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await TourModel.findById(req.params.id);
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status: "success",
        tour
    });
})

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await TourModel.create(req.body);
    res.status(201).json({
        status: "success",
        product: newTour,
    });
})

exports.updateTour = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const tour = await TourModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status: "success",
        tour
    })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const tour = await TourModel.findByIdAndDelete(id);
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(204).json({
        status: "success",
        tour
    })
})

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
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        stats
    })
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
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        plans
    })
})