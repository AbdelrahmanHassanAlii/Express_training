const ProductModel = require("../models/productModel");

// products routes Controller
exports.getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            total: products.length,
            products,
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

exports.getProduct = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        // const product = await ProductModel.findOne({_id: req.params.id})
        res.status(200).json({
            status: "success",
            product
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await ProductModel.create(req.body);

        res.status(201).json({
            status: "success",
            product: newProduct,
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }


}

exports.updateProduct = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            product: "Product updated successfully ..."
        },
    })
}

exports.deleteProduct = (req, res) => {
    res.status(204).json({
        status: "success",
        data: null,
    })
}