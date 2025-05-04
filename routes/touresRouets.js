const express = require("express");
const touresController = require("../controllers/toursControllers");
const authController = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");
const { createTourSchema, updateTourSchema } = require("../validators/toursValidator");
// const reviewsController = require("../controllers/reviewsController");
const reviewsRouter = require("./reviewsRoutes");

// creating the Routes from the express 
const router = express.Router();

// router.param(`id`, productsController.checkId)
router.use('/:tourId/reviews', reviewsRouter)

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
    .patch(authController.protect, authController.restrictTo('admin'), validateRequest(updateTourSchema), touresController.updateTour)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        touresController.deleteTour)

module.exports = router;