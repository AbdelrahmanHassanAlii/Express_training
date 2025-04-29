const express = require("express");
const reviewsController = require("../controllers/reviewsController");
const authController = require("../controllers/authController");
// const { checkId } = require("../utils/checkId");

// creating the Routes from the express 
const router = express.Router();

// router.param(`id`, checkId)

// review routes
router
    .route('/:tourId')
    .get(reviewsController.getTourReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewsController.createReview
    )

router
    .route('/')
    .get(
        authController.protect, 
        authController.restrictTo('admin'), 
        reviewsController.getAllReviews
    )

router
    .route('/review/:id')
    .get(reviewsController.getReview)

module.exports = router;
