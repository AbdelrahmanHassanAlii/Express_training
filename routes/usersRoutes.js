/* eslint-disable import/order */
const express = require("express");
const usersController = require("../controllers/usersControllers");
const authController = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");
const { signupUserSchema,
        loginUserSchema,
        updatePasswordSchema,
        updateMyProfileSchema,
        createUserSchema,
        updateUserSchema,
        updateUserPasswordSchema
    } = require("../validators/userValidator");
const rateLimit = require('express-rate-limit');


// creating the Routes from express 
const router = express.Router();

// router.param(`id`, (req, res, next, val) => {
//     console.log(`the id is ${val}`);
//     next();
// })

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
    .use(authController.protect)

router
    .route('/me')
    .get(usersController.getMy, usersController.getUser)

router
    .route('/updateMyPassword')
    .patch(validateRequest(updatePasswordSchema), authController.updateMyPassword)

router
    .route('/updateMyProfile')
    .patch(validateRequest(updateMyProfileSchema), usersController.updateMyProfile)

router
    .route('/deleteMyProfile')
    .delete(authController.restrictTo('user', 'guide'), usersController.deleteMyProfile)

router
    .use(authController.restrictTo('admin'))

router
    .route('/updateUserPassword/:id')
    .patch(validateRequest(updateUserPasswordSchema), usersController.updateUserPassword)

// user routes
router
    .route('/')
    .get(usersController.getAllUsers)
    .post(validateRequest(createUserSchema), usersController.createUser)

router
    .route('/:id')
    .get(usersController.getUser)
    .patch(validateRequest(updateUserSchema), usersController.updateUser)
    .delete(usersController.deleteUser)




module.exports = router;