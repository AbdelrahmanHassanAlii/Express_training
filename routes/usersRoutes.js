/* eslint-disable import/order */
const express = require("express");
const usersController = require("../controllers/usersControllers");
const authController = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");
const { signupUserSchema, loginUserSchema, updatePasswordSchema, updateMyProfileSchema } = require("../validators/userValidator");
const rateLimit = require('express-rate-limit');


// creating the Routes from express 
const router = express.Router();

router.param(`id`, (req, res, next, val) => {
    console.log(`the id is ${val}`);
    next();
})

// auth limiter 
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 requests per window
    message: 'Too many Sign attempts, please try again later'
});

// auth routes
router
    .route('/signup')
    .post(authLimiter, validateRequest(signupUserSchema), authController.signUp)

router
    .route('/login')
    .post(authLimiter, validateRequest(loginUserSchema), authController.logIn)

router
    .route('/forgotPassword')
    .post(authController.forgotPassword)

router
    .route('/resetPassword/:token')
    .patch(authController.resetPassword)

router
    .route('/updateMyPassword')
    .patch(authController.protect, validateRequest(updatePasswordSchema), authController.updateMyPassword)

router
    .route('/updateMyProfile')
    .patch(authController.protect, validateRequest(updateMyProfileSchema), usersController.updateMyProfile)

router
    .route('/deleteMyProfile')
    .delete(authController.protect, usersController.deleteMyProfile)

// user routes
router
    .route('/')
    .get(authController.protect,authController.restrictTo('admin'), usersController.getAllUsers)
    .post(usersController.createUser)

router
    .route('/:id')
    .get(usersController.getUser)
    .patch(authController.protect, usersController.updateUser)
    .delete(authController.protect, authController.restrictTo('admin'), usersController.deleteUser)




module.exports = router;