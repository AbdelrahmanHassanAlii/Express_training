const express = require("express");
const productsController = require("../controllers/productsControllers");

// creating the Routes from the express 
const router = express.Router();

// router.param(`id`, productsController.checkId)

// product routes
router
    .route('/')
    .get(productsController.getProducts)
    .post(productsController.createProduct)

router
    .route('/:id')
    .get(productsController.getProduct)
    .patch(productsController.updateProduct)
    .delete(productsController.deleteProduct)

module.exports = router;