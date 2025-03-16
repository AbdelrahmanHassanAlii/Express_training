const express = require("express");
const touresController = require("../controllers/toursControllers");

// creating the Routes from the express 
const router = express.Router();

// router.param(`id`, productsController.checkId)

// product routes
router
    .route('/')
    .get(touresController.getTours)
    .post(touresController.createTour)

router
    .route('/:id')
    .get(touresController.getTour)
    .patch(touresController.updateTour)
    .delete(touresController.deleteTour)

module.exports = router;