class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        // Prevents prototype pollution attacks
        Error.captureStackTrace(this, this.constructor);
    }   

    // static isOperationalError(error) {
    //     return error instanceof AppError;
    // }
}

module.exports = AppError;