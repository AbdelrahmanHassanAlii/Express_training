const express = require("express");
const usersController = require("../controllers/usersControllers");

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

module.exports = router;