const express = require("express");
const reviewsController = require("../controllers/reviewsController");
const authController = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");
const { updateReviewSchema, createReviewSchema } = require("../validators/reviewValidator");
// creating the Routes from the express 
const router = express.Router({mergeParams: true});


// review routes

router
    .route('/all')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        reviewsController.getAllReviews);

router
    .route('/')
    .post(
            authController.protect,
            authController.restrictTo('user'),
            validateRequest(createReviewSchema),
            reviewsController.createReview
        )
    .get(reviewsController.getTourReviews)

router
    .route('/:id')
    .get(reviewsController.getReview)
    .delete(
        authController.protect,
        authController.restrictTo('user'),
        reviewsController.deleteReview
    )
    .patch(
        authController.protect,
        authController.restrictTo('user'),
        validateRequest(updateReviewSchema),
        reviewsController.updateReview
    )




module.exports = router;
