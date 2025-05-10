/* eslint-disable import/no-extraneous-dependencies */
const { mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
        // works only with create and save and not with update
        validate: {
            validator: function (v) {
                return this.password === v;
            },
            message: 'Passwords do not match'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'guide', 'lead-guide'],
        default: 'user'
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordChangedAt: {
        type: Date,
        default: null
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// userSchema.pre(/^find/, function (next) {
//     this.find({ active: true });
//     next();
// })

// working only with create and save
userSchema.pre('save', async function (next) {
    // Only hash if password was modified
    if (!this.isModified('password')) return next();
    // Hash password with cost factor of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

// ✅ Fix: Set passwordChangedAt only if password was updated (and not on new user creation)
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second
    next();
});

// 🔐 Check if user changed password after token was issued
userSchema.methods.passwordChangedAfterToken = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }

    // False means password NOT changed after token
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    // Generate a random 32-byte token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Create a SHA256 hash of the token and set 
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log(resetToken, this.passwordResetToken);
    // Set the token expiration time
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: true });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;


