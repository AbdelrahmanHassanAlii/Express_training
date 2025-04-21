const User = require("../models/userModel");
const { catchAsync } = require("../utils/catchAsync");
const filterObj = require("../utils/filterObj");
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


exports.updateMyProfile = catchAsync(async (req, res, next) => {
    // 1) Filter out the fields that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    // 2) update the user
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true, 
        runValidators: true 
    });
    // 3) send response
    sendResponse(res, 200, 'User details', updatedUser);
})
