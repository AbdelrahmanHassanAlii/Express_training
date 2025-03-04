const express = require("express");
const fs = require("fs");
const path = require("path");

// creating the Routes from the express 
const router = express.Router();

// getting all the products
const productsPath = path.join(__dirname, "../data/products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

// products routes handlers
const getAllProducts = (req, res) => {
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        totalResults: products.length,
        data: { products },
    });
}

const getProduct = (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    const product = products.find((p) => p.id === +id);

    if (!product) {
        return res.status(404).json({
            status: "fail",
            message: `Product with id ${id} not found`,
        });
    }

    res.status(200).json({
        status: "success",
        data: { product },
    });
}

const createProduct = (req, res) => {
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = Object.assign({ id: newId }, req.body);

    products.push(newProduct);

    fs.writeFile(`${__dirname}/data/products.json`, JSON.stringify(products), (err) => {
        if (err) {
            return res.status(500).json({
                status: "fail",
                message: "Internal server error",
            });
        }

        res.status(201).json({
            status: "success",
            product: newProduct,
        });
    });
}

const updateProduct = (req, res) => {
    const { id } = req.params;
    const product = products.find((p) => p.id === +id);

    if (!product) {
        return res.status(404).json({
            status: "fail",
            message: `Product with id ${id} not found`,
        });
    }

    res.status(200).json({
        status: "success",
        data: { 
            product : "Product updated successfully ..."
        },
    })
}

const deleteProduct = (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex((p) => p.id === +id);

    if (productIndex === -1) {
        return res.status(404).json({
            status: "fail",
            message: `Product with id ${id} not found`,
        });
    }

    res.status(204).json({
        status: "success",
        data: null,
    })
}

// product routes
router
    .route('/')
    .get(getAllProducts)
    .post(createProduct)

router
    .route('/:id')
    .get(getProduct)
    .patch(updateProduct)
    .delete(deleteProduct)

module.exports = router;