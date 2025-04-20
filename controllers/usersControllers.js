const User = require("../models/userModel");
const { catchAsync } = require("../utils/catchAsync");
const { sendResponse } = require("../utils/response");

// user routes handlers
exports.getAllUsers = catchAsync( async (req, res) => {
    const users = await User.find();
    sendResponse(res, 200, 'All users', users, { count: users.length});
})

exports.getUser = catchAsync( async (req, res) => {
    const user = await User.findById(req.params.id);
    sendResponse(res, 200, 'User details', user);
})

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "not implemented yet",
    })
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "not implemented yet",
    })
}

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "not implemented yet",
    })
}


exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "not implemented yet",
    })
}

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "not implemented yet",
    })
}