/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require("../models/userModel")
const AppError = require("../utils/appError")
const { catchAsync } = require("../utils/catchAsync")
const { createUserSchema } = require("../validators/userValidator");
const generateSignToken = require("../utils/signToken");
const sendEmail = require('../utils/email');
const crypto = require('crypto');


exports.signUp = catchAsync(async (req, res, next) => {
    // validate the input
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }
    // create user
    const user = await User.create({
        name: value.name,
        email: value.email,
        password: value.password,
        passwordConfirm: value.passwordConfirm
    });
    // remove password from the user
    user.password = undefined;
    // generate token
    const token = generateSignToken(user._id);
    // return response
    res.status(201).json({
        status: "success",
        token,
        user,
    })
})

exports.logIn = catchAsync(async (req, res, next) => {
    // validate the input
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    // check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError('Invalid credentials', 401));
    }
    // remove password from the user
    user.password = undefined;
    // generate token
    const token = generateSignToken(user._id);
    // return response
    res.status(200).json({
        status: "success",
        token,
        user,
    })
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

exports.restricTo = (...roles) => 
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

    // 3) sent the randon token via email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your password and passwordConfirm to: ${resetURL}\r\n\r\n`;
    try{
        await sendEmail({
            to: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });
        
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!🚀'
        });
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

    // 5) generate the token
    const token = generateSignToken(user._id);

    // 6) send the response
    res.status(200).json({
        status: 'success',
        token,
        user
    })
})
