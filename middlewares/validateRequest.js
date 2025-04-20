const AppError = require("../utils/appError");

module.exports = (schema) => 
    (req, res, next) => {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return next(new AppError(error.details[0].message, 400));
        }
        req.validatedBody = value; 
        next();
    ;
};