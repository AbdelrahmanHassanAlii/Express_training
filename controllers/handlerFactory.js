const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { sendResponse } = require("../utils/response");

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    sendResponse(res, 204, 'Document deleted successfully', doc);
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const id = req.params.id || req.user.id;
    // console.log(id);
    req.body = req.validatedBody || req.body;
    // req.validatedBody && console.log(req.validatedBody);
    const doc = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    })
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    sendResponse(res, 200, 'Document updated successfully', doc);
});