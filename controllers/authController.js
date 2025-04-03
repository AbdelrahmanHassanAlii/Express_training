const User = require("../models/userModel")
const AppError = require("../utils/appError")
const { catchAsync } = require("../utils/catchAsync")
const { createUserSchema } = require("../validators/userValidator")


exports.signUp = catchAsync(async (req, res, next) => {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }   
    const user = await User.create(value);
    res.status(201).json({
        status: "success",
        user
    })
}) 