const AppError = require("./appError");

exports.checkId = (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError('Invalid ID', 400));
    }
    next();
};
