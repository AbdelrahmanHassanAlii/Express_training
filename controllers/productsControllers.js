const ProductModel = require("../models/productModel");
const { catchAsync } = require("../utils/catchAsync");

// products routes Controller
exports.getProducts = catchAsync(async (req, res) => {
        const products = await ProductModel.find();
        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            total: products.length,
            products,
        })
    }
)

exports.getProduct = catchAsync(async (req, res) => {
    const product = await ProductModel.findById(req.params.id);
    res.status(200).json({
        status: "success",
        product
    })
})

exports.createProduct = catchAsync(async (req, res) => {
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json({
        status: "success",
        product: newProduct,
    });
})

exports.updateProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
        const product = await ProductModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "success",
            product
        })
})

exports.deleteProduct = catchAsync(async (req, res) => {
    const { id } = req.params
    const product = await ProductModel.findByIdAndDelete(id);
    res.status(204).json({
        status: "success",
        product
    })
})