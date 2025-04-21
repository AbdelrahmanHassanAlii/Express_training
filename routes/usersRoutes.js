const express = require("express");
const usersController = require("../controllers/usersControllers");
const authController = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");
const { createUserSchema, loginUserSchema, updatePasswordSchema, updateMyProfileSchema } = require("../validators/userValidator");
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

// auth routes
router
    .route('/signup')
    .post(validateRequest(createUserSchema), authController.signUp)

router
    .route('/login')
    .post(validateRequest(loginUserSchema), authController.logIn)
//     .post(authLimiter, usersController.logIn)

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

// user routes
router
    .route('/')
    .get(authController.protect,authController.restricTo('admin'), usersController.getAllUsers)
    .post(usersController.createUser)

router
    .route('/:id')
    .get(usersController.getUser)
    .patch(authController.protect, usersController.updateUser)
    .delete(usersController.deleteUser)




module.exports = router;