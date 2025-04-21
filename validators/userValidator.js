/* eslint-disable import/no-extraneous-dependencies */
const Joi = require('joi');
const { passwordStrength } = require('check-password-strength');

// Custom password strength validator
const passwordComplexity = (value, helpers) => {
    const result = passwordStrength(value);
    if (result.id < 1) { // 0-weak, 1-medium, 2-strong, 3-very strong
        return helpers.error('password.complexity');
    }
    return value;
};

const createUserSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(30)
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name should have at least {#limit} characters',
            'string.max': 'Name should not exceed {#limit} characters'
        }),

    email: Joi.string()
        .required()
        .email()
        .lowercase()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address'
        }),

    password: Joi.string()
        .required()
        .min(8)
        .custom(passwordComplexity, 'Password strength validation')
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password should have at least {#limit} characters',
            'password.complexity': 'Password is too weak. Include uppercase, numbers, and special characters'
        }),

    passwordConfirm: Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .messages({
            'any.only': 'Passwords do not match',
            'string.empty': 'Please confirm your password'
        }),

    role: Joi.string()
        .valid('user', 'admin', 'guide')
        .default('user'),

    photo: Joi.string()
        .default('default.jpg'),

    active: Joi.boolean()
        .default(true)
});

const loginUserSchema = Joi.object({
    email: Joi.string()
        .required()
        .email()
        .lowercase()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address'
        })
    ,
    password: Joi.string()
        .required()
        .min(8)
        .custom(passwordComplexity, 'Password strength validation')
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password should have at least {#limit} characters',
            'password.complexity': 'Password is too weak. Include uppercase, numbers, and special characters'
        })
    
})
;

const updateMyProfileSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(30),

    email: Joi.string()
        .email()
        .lowercase(),

    password: Joi.forbidden().messages({
        'any.unknown': 'You cannot update password from this route! if you want to update password please use /updateMyPassword'
    }),

    passwordConfirm: Joi.forbidden().messages({
        'any.unknown': 'You cannot update password from this route! if you want to update password please use /updateMyPassword'
    }),

    photo: Joi.string(),

    active: Joi.boolean()
}).min(1);

const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .min(8)
        .custom(passwordComplexity, 'Old Password strength validation')
        .messages({
            'string.empty': 'Old Password is required',
            'string.min': 'Old Password should have at least {#limit} characters',
            'password.complexity': 'Old Password is too weak. Include uppercase, numbers, and special characters'
        }),

    newPassword: Joi.string()
        .required()
        .min(8)
        .custom(passwordComplexity, 'New Password strength validation')
        .messages({
            'string.empty': 'New Password is required',
            'string.min': 'New Password should have at least {#limit} characters',
            'password.complexity': 'New Password is too weak. Include uppercase, numbers, and special characters'
        }),

    newPasswordConfirm: Joi.string()
        .required()
        .valid(Joi.ref('newPassword'))
        .messages({
            'any.only': 'Passwords do not match',
            'string.empty': 'Please confirm your password'
        })
})

module.exports = {
    createUserSchema,
    loginUserSchema,
    updateMyProfileSchema,
    updatePasswordSchema
};