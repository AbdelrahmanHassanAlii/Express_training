const express = require("express");
const usersController = require("../controllers/usersControllers");
const authController = require("../controllers/authController");

// creating the Routes from express 
const router = express.Router();

router.param(`id`, (req, res, next, val) => {
    console.log(`the id is ${val}`);
    next();
})

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

// router
//     .route('/login')
//     .post(usersController.logIn)

module.exports = router;