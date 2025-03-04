const express = require("express");
const productsController = require("../controllers/products");

// creating the Routes from the express 
const router = express.Router();

// product routes
router
    .route('/')
    .get(productsController.getAllProducts)
    .post(productsController.createProduct)

router
    .route('/:id')
    .get(productsController.getProduct)
    .patch(productsController.updateProduct)
    .delete(productsController.deleteProduct)

module.exports = router;