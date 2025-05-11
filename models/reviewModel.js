/* eslint-disable prefer-arrow-callback */
const { mongoose } = require("mongoose");
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        trim: true,
        required: [true, 'Please add a review']
    },
    rate: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    tour:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must be belong to a Tour']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must be belong to a User']
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

reviewSchema.pre(/^find/, function (next) {
    this
    // .populate({
    //     path: 'tour',
    //     select: 'name'
    // })
    .populate({
        path: 'user',
        select: 'name photo'
    })
    next();
})

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        }
        ,
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rate' }
            }
        }
    ])

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    }else{
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
}


reviewSchema.post('save', function (doc, next) {
    // this.constructor points to the model
    doc.constructor.calcAverageRatings(doc.tour);
    next();
})

// After updating or deleting a review
reviewSchema.post(/^findOneAnd/, async function (doc) {
    if (doc) await doc.constructor.calcAverageRatings(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;