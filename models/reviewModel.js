const { mongoose } = require("mongoose");

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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;