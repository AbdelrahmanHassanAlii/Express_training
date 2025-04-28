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
        trim: true,
        validate: {
            validator: function (val) {
                return !/\d/.test(val);
            },
            message: 'Tour name must contain only letters'
        }
    },
    slug: String,
    price: {
        type: Number,
        required: [true, 'Please add a price of tour']
    },
    priceDiscount: {
        type: Number,
        default: 0,
        validate: {
            validator: function (val) {
                // this keyword only works on .create() or .save() not on .updateOne()
                return val <= this.price;
            },
            message: 'Price discount ({VALUE}) must be less than the price ({this.price})'
        }
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
        required: [true, 'Please add a difficulty of tour'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
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
    secretTour: {
        type: Boolean,
        default: false
    },
    guides: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
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

// Query middleware

// this find middleware will run before all the find operation like .find() or .findById() etc...
tourSchema.pre(/^find/, function (next) {
    // this.find({ secretTour: { $ne: true } });
    this.startingTime = Date.now();
    this.find({ secretTour: false });
    next();
})

// this find middleware will run before all the find operation like .find() or .findById() etc...
tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    })
    next();
})

// this find middleware will run after all the find operation like .find() or .findById() etc...
tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.startingTime} ms`);
    next();
})

// Aggregation middleware

// this aggregate middleware will run before all the aggregate operation like .aggregate()
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: false } });
    next();
})


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
