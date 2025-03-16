const { mongoose } = require("mongoose");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name of product'],
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'Please add a price of product']
    },
    description: {
        type: String,
        required: [true, 'Please add a description of product'],
        Minlength: [10, 'the description must be at least 10 characters long'],
        maxlength: [100, 'the description must be at most 100 characters long']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
