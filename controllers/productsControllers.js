const ProductModel = require("../models/productModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

// products routes Controller
exports.getProducts = catchAsync(async (req, res, next) => {
        const products = await ProductModel.find();
        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            total: products.length,
            products,
        })
    }
)

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }
    res.status(200).json({
        status: "success",
        product
    })
})

exports.createProduct = catchAsync(async (req, res, next) => {
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json({
        status: "success",
        product: newProduct,
    });
})

exports.updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
        const product = await ProductModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return next(new AppError('No product found with that ID', 404));
        }

        res.status(200).json({
            status: "success",
            product
        })
})

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(204).json({
        status: "success",
        product
    })
})