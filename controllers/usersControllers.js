const User = require("../models/userModel");
const { catchAsync } = require("../utils/catchAsync");
// const filterObj = require("../utils/filterObj");
const { sendResponse } = require("../utils/response");
const { deleteOne, updateOne } = require("./handlerFactory");

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

exports.deleteUser = deleteOne(User)

exports.deleteMyProfile = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    sendResponse(res, 204, 'User deleted', null);
})

exports.updateMyProfile = updateOne(User)
