/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require("../models/userModel")
const AppError = require("../utils/appError")
const { catchAsync } = require("../utils/catchAsync")
const sendEmail = require('../utils/email');
const { createSendToken, sendResponse } = require('../utils/response');
const { createOne } = require('./handlerFactory');

exports.signUp = createOne(User)

exports.logIn = catchAsync(async (req, res, next) => {
    // get validated data from previous middleware
    const { email, password } = req.validatedBody;
    // check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError('Invalid credentials', 401));
    }
    // generate token and return response
    createSendToken(user, 200, res);
})

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Check if token exists
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const { id } = decoded;
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError('The user belongs to this token does no longer exist.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (user.passwordChangedAfterToken(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }
    // 5) Grant access to protected route
    req.user = user;
    // res.locals.user = user;
    next();
})

exports.restrictTo = (...roles) => 
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1 ) geeting the user based on email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) sent the random token via email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your password and passwordConfirm to: ${resetURL}\r\n\r\n`;
    try{
        await sendEmail({
            to: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });
        sendResponse(res, 200, 'Token sent to email!🚀');
    }catch(error){
        console.error(error);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Failed to send reset password email', 500));
    }
})  

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1 ) get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
    // 2) check if token is still valid
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    // 3) update the password and the fields
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4) update the passwordChangedAt property
    // this is done automatically by the model of the user

    // 5) generate the token and send response
    createSendToken(user, 200, res);
})

exports.updateMyPassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user._id).select('+password');
    // 2) Check if POSTed current password is correct
    if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }
    // 3) If so, update password
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await user.save();
    
    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
})
