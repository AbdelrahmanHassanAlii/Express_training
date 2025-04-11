/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require("../models/userModel")
const AppError = require("../utils/appError")
const { catchAsync } = require("../utils/catchAsync")
const { createUserSchema } = require("../validators/userValidator");
const generateSignToken = require("../utils/signToken");


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
