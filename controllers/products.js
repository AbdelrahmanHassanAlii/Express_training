const fs = require("fs");
const path = require("path");

// getting all the products
const productsPath = path.join(__dirname, "../data/products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

// check the body middleware
exports.checkBody = (req, res, next) => {
    const { name, price, description } = req.body;
    if (!name) return res.status(400).json({ status: "fail", message: `Missing name` });
    if (!price) return res.status(400).json({ status: "fail", message: `Missing price` });
    if (!description) return res.status(400).json({ status: "fail", message: `Missing description` });
    next();
}

// check the id is valid or not
exports.checkId = (req, res, next, val) => {
    if (products[val]) next();
    else return res.status(404).json({ status: "fail", message: `Product with id ${val} not found` });
};

// products routes Controller
exports.getAllProducts = (req, res) => {
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        totalResults: products.length,
        data: { products },
    });
}

exports.getProduct = (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    const product = products.find((p) => p.id === +id);

    // if (!product) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: `Product with id ${id} not found`,
    //     });
    // }

    res.status(200).json({
        status: "success",
        data: { product },
    });
}

exports.createProduct = (req, res) => {
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = Object.assign({ id: newId }, req.body);

    products.push(newProduct);

    fs.writeFile(path.join(__dirname, "../data/products.json"), JSON.stringify(products), (err) => {
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

exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const product = products.find((p) => p.id === +id);

    // if (!product) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: `Product with id ${id} not found`,
    //     });
    // }

    res.status(200).json({
        status: "success",
        data: {
            product: "Product updated successfully ..."
        },
    })
}

exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex((p) => p.id === +id);

    // if (productIndex === -1) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: `Product with id ${id} not found`,
    //     });
    // }

    res.status(204).json({
        status: "success",
        data: null,
    })
}