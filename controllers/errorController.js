/* eslint-disable no-console */
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
        errorProd(err, res)
    }

    next();
}
