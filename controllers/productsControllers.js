const ProductModel = require("../models/productModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { sendResponse } = require("../utils/response");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlerFactory");

// products routes Controller
exports.getProducts = getAll(ProductModel)

exports.getProduct = getOne(ProductModel)

exports.createProduct = createOne(ProductModel)

exports.updateProduct = updateOne(ProductModel)

exports.deleteProduct = deleteOne(ProductModel)