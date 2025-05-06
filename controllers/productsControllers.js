const ProductModel = require("../models/productModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { sendResponse } = require("../utils/response");
const { deleteOne, updateOne, createOne, getOne } = require("./handlerFactory");

// products routes Controller
exports.getProducts = catchAsync(async (req, res, next) => {
        const products = await ProductModel.find();
        sendResponse(res, 200, 'All products', products, { total: products.length, requestedAt: req.requestTime });
    }
)

exports.getProduct = getOne(ProductModel)

exports.createProduct = createOne(ProductModel)

exports.updateProduct = updateOne(ProductModel)

exports.deleteProduct = deleteOne(ProductModel)