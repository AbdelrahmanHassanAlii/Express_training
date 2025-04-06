/* eslint-disable import/no-extraneous-dependencies */
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
    if(!user || !(await user.comparePassword(password, user.password))){
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
