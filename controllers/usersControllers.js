const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
// const filterObj = require("../utils/filterObj");
const { sendResponse } = require("../utils/response");
const { deleteOne, updateOne } = require("./handlerFactory");

// user routes handlers
exports.getAllUsers = catchAsync( async (req, res) => {
    const users = await User.find();
    sendResponse(res, 200, 'All users', users, { count: users.length});
})

exports.getUser = catchAsync( async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }
    sendResponse(res, 200, 'User details', user);
})

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "not implemented yet",
    })
}

exports.updateUser = updateOne(User)

exports.updateUserPassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('+password');
    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }
    user.password = req.validatedBody.password;
    user.passwordConfirm = req.validatedBody.passwordConfirm;
    await user.save();
    sendResponse(res, 200, 'User password updated', user);
})

exports.deleteUser = deleteOne(User)

exports.deleteMyProfile = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    sendResponse(res, 204, 'User deleted', null);
})

exports.updateMyProfile = updateOne(User)
