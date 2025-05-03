const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { sendResponse } = require("../utils/response");

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    sendResponse(res, 204, 'Document deleted successfully', doc);
});