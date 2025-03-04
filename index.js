const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();

const products = JSON.parse(fs.readFileSync(`${__dirname}/data/products.json`, "utf-8"));

// Middleware to parse JSON body
app.use(express.json());

// Middleware to log the request
app.use((req, res, next) => {
    console.log("Hello from the middleware 🤙!");
    next();
})

// Middleware to measure the time it takes to execute the request
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// middleware to log the request
app.use(morgan("dev"))

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

// user routes handlers
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "not implemented yet",
    })
}

const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "not implemented yet",
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "not implemented yet",
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "not implemented yet",
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "not implemented yet",
    })
}

// product routes
app.route('/api/v1/products')
    .get(getAllProducts)
    .post(createProduct)

app.route('/api/v1/products/:id')
    .get(getProduct)
    .patch(updateProduct)
    .delete(deleteProduct)

// user routes
app.route('/api/v1/users')
    .get(getAllUsers)
    .post(createUser)

app.route('/api/v1/users/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

// start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} 🚀`);
});
