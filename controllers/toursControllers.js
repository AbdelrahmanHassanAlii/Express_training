/* eslint-disable node/no-unsupported-features/es-syntax */
const TourModel = require("../models/tourModel");

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
        else {
            query = query.sort('-createdAt');
        }

        // 3) Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }
        // default field limiting (exclude createdAt, updatedAt, __v)
        else {
            query = query.select('-createdAt -updatedAt -__v');
        }

        // 4A) Pagination
        const page = parseInt(req.query.page, 10);
        const limit = parseInt(req.query.limit, 10);
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        // 4B) handle go out of the limit
        if (req.query.page && req.query.limit) {
            const tourCount = await TourModel.countDocuments(queryObject);
            if( skip >= tourCount ) throw new Error('This page does not exist');
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