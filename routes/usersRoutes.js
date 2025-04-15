const express = require("express");
const usersController = require("../controllers/usersControllers");
const authController = require("../controllers/authController");
// const rateLimit = require('express-rate-limit');


// creating the Routes from express 
const router = express.Router();

router.param(`id`, (req, res, next, val) => {
    console.log(`the id is ${val}`);
    next();
})

// auth limiter 
// const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 10, // Limit each IP to 10 requests per window
//     message: 'Too many login attempts, please try again later'
// });

// user routes
router
    .route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createUser)

router
    .route('/:id')
    .get(usersController.getUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)


// auth routes
router
    .route('/signup')
    .post(authController.signUp)

router
    .route('/login')
    .post(authController.logIn)
//     .post(authLimiter, usersController.logIn)

router
    .route('/forgotPassword')
    .post(authController.forgotPassword)

router
    .route('/resetPassword/:token')
    .patch(authController.resetPassword)

module.exports = router;