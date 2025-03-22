/* eslint-disable node/no-unsupported-features/es-syntax */
const TourModel = require("../models/tourModel");
const ApiFeatures = require("../utils/apiFeatures");

// custom routes
exports.get2Cheapest = async (req, res, next) => {
    req.query.limit = 2;
    req.query.page = 1;
    req.query.sort = '-raitingAverage price';
    req.query.fields = 'name price duration';
    next();
}
// products routes Controller
exports.getTours = async (req, res) => {
    try {

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
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await TourModel.findById(req.params.id);
        // const product = await ProductModel.findOne({_id: req.params.id})
        res.status(200).json({
            status: "success",
            tour
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

exports.createTour = async (req, res) => {
    try {
        const newTour = await TourModel.create(req.body);

        res.status(201).json({
            status: "success",
            product: newTour,
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }


}

exports.updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        const tour = await TourModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "success",
            tour
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        const { id } = req.params
        const tour = await TourModel.findByIdAndDelete(id);
        res.status(204).json({
            status: "success",
            tour
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}