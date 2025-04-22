/* eslint-disable node/no-unsupported-features/es-syntax */
const generateSignToken = require("./signToken");

exports.sendResponse = (res, statusCode, message, data = null, extras = {}) => {
    const response = {
        status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
        message,
        ...extras 
    };

    if(data !== null) {
        response.data = data;
    }

    res.status(statusCode).json(response);
};

exports.createSendToken = (user, statusCode, res) => {
    const token = generateSignToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // secure: true,
        // sameSite: 'None'
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }
    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}