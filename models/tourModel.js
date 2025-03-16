const { mongoose } = require("mongoose");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name of tour'],
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please add a price of tour']
    },
    priceDiscount: {
        type: Number,
        default: 0
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'Please add a summary of tour'],
        Minlength: [10, 'the summary must be at least 10 characters long'],
        maxlength: [100, 'the summary must be at most 100 characters long']
    },
    description: {
        type: String,
        trim: true,
        Minlength: [10, 'the description must be at least 10 characters long'],
        maxlength: [350, 'the description must be at most 100 characters long']
    },
    duration: {
        type: Number,
        required: [true, 'Please add a duration of tour']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Please add a maxGroupSize of tour']
    },
    difficulty: {
        type: String,
        required: [true, 'Please add a difficulty of tour']
    },
    ratingsAverage: {
        type: Number,
        default: 0
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    imageCover: {
        type: String,
        required: [true, 'Please add a imageCover of tour']
    },
    images: [String],
    startDates: [Date],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
