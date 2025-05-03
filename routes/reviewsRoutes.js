const express = require("express");
const reviewsController = require("../controllers/reviewsController");
const authController = require("../controllers/authController");

// creating the Routes from the express 
const router = express.Router();


// review routes

router
    .route('/')
    .get(
        authController.protect, 
        authController.restrictTo('admin'), 
        reviewsController.getAllReviews
    )


module.exports = router;
