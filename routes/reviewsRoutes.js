const express = require("express");
const reviewsController = require("../controllers/reviewsController");
const authController = require("../controllers/authController");

// creating the Routes from the express 
const router = express.Router({mergeParams: true});


// review routes

router
    .get('/all', reviewsController.getAllReviews);

router
    .route('/')
    .post(
            authController.protect,
            authController.restrictTo('user'),
            reviewsController.createReview
        )
    .get(reviewsController.getTourReviews)

router
    .route('/:id')
    .get(reviewsController.getReview)




module.exports = router;
