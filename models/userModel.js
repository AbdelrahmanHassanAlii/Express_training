/* eslint-disable import/no-extraneous-dependencies */
const { mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name of user'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email of user'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password of user'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        select: false,
        validate: {
            validator: function (v) {
                return this.password === v;
            },
            message: 'Passwords do not match'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'guide'],
        default: 'user'
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// userSchema.pre(/^find/, function (next) {
//     this.find({ active: true });
//     next();
// })

userSchema.pre('save', async function(next) {
    // Only hash if password was modified
    if (!this.isModified('password')) return next();
    // Hash password with cost factor of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;


