const express = require("express");
const touresController = require("../controllers/toursControllers");
const authController = require("../controllers/authController");

// creating the Routes from the express 
const router = express.Router();

// router.param(`id`, productsController.checkId)

// custom routes
router
    .route('/get-2-cheap')
    .get(touresController.get2Cheapest, touresController.getTours)

router
    .route('/stats')
    .get(touresController.tourStats)

router
    .route('/monthly-plan/:year')
    .get(touresController.getMonthlyPlans)

// product routes
router
    .route('/')
    .get(authController.protect, touresController.getTours)
    .post(touresController.createTour)

router
    .route('/:id')
    .get(touresController.getTour)
    .patch(touresController.updateTour)
    .delete(touresController.deleteTour)

module.exports = router;