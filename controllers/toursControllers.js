/* eslint-disable node/no-unsupported-features/es-syntax */
const TourModel = require("../models/tourModel");

// products routes Controller
exports.getTours = async (req, res) => {
    try {
        // 1A) prepare the query (Basic Filtering)
        let queryObject = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((field) => delete queryObject[field]);

        // 1B) convert the query to mongoose query (Advanced Filtering)
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        queryObject = JSON.parse(queryString);

        // prepare the query
        let query = TourModel.find(queryObject);

        // 2) sort the query
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
        // default sort by createdAt (desc)
        else{
            query = query.sort('-createdAt');
        }

        // await the query
        const tours = await query;

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