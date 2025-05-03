const ProductModel = require("../models/productModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { sendResponse } = require("../utils/response");
const { deleteOne } = require("./handlerFactory");

// products routes Controller
exports.getProducts = catchAsync(async (req, res, next) => {
        const products = await ProductModel.find();
        sendResponse(res, 200, 'All products', products, { total: products.length, requestedAt: req.requestTime });
    }
)

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }
    sendResponse(res, 200, 'Product details', product);
})

exports.createProduct = catchAsync(async (req, res, next) => {
    const newProduct = await ProductModel.create(req.body);
    sendResponse(res, 201, 'Product created', newProduct);
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

    sendResponse(res, 200, 'Product updated', product);
})

exports.deleteProduct = deleteOne(ProductModel)