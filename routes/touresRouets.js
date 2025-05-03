const express = require("express");
const touresController = require("../controllers/toursControllers");
const authController = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");
const { createTourSchema } = require("../validators/toursValidator");
const reviewsController = require("../controllers/reviewsController");

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
    .post(validateRequest(createTourSchema), touresController.createTour)

router
    .route('/:id')
    .get(touresController.getTour)
    .patch(touresController.updateTour)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        touresController.deleteTour)

// reviews routes
router
    .route('/:tourId/reviews')
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewsController.createReview
    )
    .get(reviewsController.getTourReviews)

    router
    .route('/:tourId/reviews/:id')
    .get(reviewsController.getReview)


module.exports = router;