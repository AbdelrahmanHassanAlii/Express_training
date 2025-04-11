/* eslint-disable node/no-unsupported-features/es-syntax */
const AppError = require("../utils/appError")

/* eslint-disable no-console */
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateKeyError = (err) => {
    const value = err.errmsg.match(/"(.*?)"/)[1]
    const message = `Duplicate field value: ${value}`
    return new AppError(message, 400)
}

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data: ${errors.join(', ')}`
    return new AppError(message, 400)
}

const handleJWTError = () => {
    const message = 'Invalid token, please log in again'
    return new AppError(message, 401)
}

const handleJWTExpiredError = () => {
    const message = 'Token expired, please log in again'
    return new AppError(message, 401)
}

const errorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const errorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.error("ERROR IN PRODUCTION 💥", err)
        res.status(500).json({
            status: "error",
            message: "Something went wrong"
        })
    }
}

exports.errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    err.message = err.message || "Something went wrong";

    if (process.env.NODE_ENV === 'development') {
        errorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        if (err.name === "CastError") {
            error = handleCastError(error)
        }
        if (err.code === 11000) {
            error = handleDuplicateKeyError(error)
        }
        if (err.name === "ValidationError") {
            error = handleValidationError(error)
        }
        if (err.name === "JsonWebTokenError") {
            error = handleJWTError(error)
        }
        if (err.name === "TokenExpiredError") {
            error = handleJWTExpiredError(error)
        }
        errorProd(error, res)
    }

    next();
}
