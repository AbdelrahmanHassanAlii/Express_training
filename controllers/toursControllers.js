/* eslint-disable node/no-unsupported-features/es-syntax */
const TourModel = require("../models/tourModel");

// products routes Controller
exports.getTours = async (req, res) => {
    try {
        // prepare the query 
        const queryObject = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((field) => delete queryObject[field]);
        const query = TourModel.find(queryObject);

        // await the query
        const Tours = await query;

        // return the response
        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            total: Tours.length,
            Tours,
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