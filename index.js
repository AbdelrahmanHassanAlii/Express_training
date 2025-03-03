const express = require("express");
const fs = require("fs");
const app = express();

const products = JSON.parse(fs.readFileSync(`${__dirname}/data/products.json`, "utf-8"));

// Middleware to parse JSON body
app.use(express.json());

// function of get all products
const getAllProducts = (req, res) => {
    res.status(200).json({
        status: "success",
        totalResults: products.length,
        data: { products },
    });
}

// function to get product by id
const getProductById = (req, res) => {
    console.log(req.params);  // ✅ Now this will work!
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

// function to create a new product
const createNewProduct = (req, res) => {
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

// // Get all products
// app.get("/api/v1/products", getAllProducts);

// // Get product by ID
// app.get("/api/v1/products/:id", getProductById);

// // Create a new product
// app.post("/api/v1/products", createNewProduct);

// // Update a product
// app.patch("/api/v1/products/:id", updateProduct)

// // Delete a product
// app.delete("/api/v1/products/:id", deleteProduct);

app.route('/api/v1/products')
    .get(getAllProducts)
    .post(createNewProduct)

app.route('/api/v1/products/:id')
    .get(getProductById)
    .patch(updateProduct)
    .delete(deleteProduct)

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} 🚀`);
});
