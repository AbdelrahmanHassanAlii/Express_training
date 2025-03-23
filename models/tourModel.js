/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const { mongoose } = require("mongoose");
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name of tour'],
        unique: true,
        trim: true
    },
    slug: String,
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// virtual properties
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

tourSchema.virtual('netPrice').get(function () {
    return this.price - this.priceDiscount;
})

// Document middleware

// this save middleware will run before the save operation like .save() or .create() but not .insertMany()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

// tourSchema.pre('save', async function (next) {
//     const tour = await TourModel.findOne({ name: this.name });
//     if (tour) {
//         next(new AppError('Tour name already exists', 400));
//     }
//     next();
// })

// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// })

tourSchema.post('save', function (doc, next) {
    console.log(`Tour ${doc.name} saved successfully 😍`);
    next();
})
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
