const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { sendResponse } = require("../utils/response");

exports.createOne = (Model, getExtraFields = () => ({})) =>
    catchAsync(async (req, res, next) => {
        req.body = req.validatedBody || req.body;
        const data = {
            ...req.body,
            ...getExtraFields(req)
        };

        const doc = await Model.create(data);
        sendResponse(res, 201, 'Document created successfully', doc);
    });

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

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (populateOptions) query = query.populate(populateOptions)
    const doc = await query;
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    sendResponse(res, 200, 'Document details', doc);
})

exports.getAll = (Model, filter = {}) => catchAsync(async (req, res, next) => {
    // If the filter values are functions (like: { tour: (req) => req.params.tourId }),
    console.log(filter)
    // evaluate them using req
    const evaluatedFilter = Object.entries(filter).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'function' ? value(req) : value;
        return acc;
    }, {});
    const apiFeatures = new ApiFeatures(Model.find(evaluatedFilter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const docs = await apiFeatures.query;

    sendResponse(res, 200, 'All documents', docs, {
        total: docs.length,
        requestedAt: req.requestTime
    });
});
