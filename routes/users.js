const express = require("express");
const usersController = require("../controllers/users");

// creating the Routes from express 
const router = express.Router();

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