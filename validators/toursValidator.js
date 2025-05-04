const Joi = require('joi');

const createTourSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(30)
        .trim()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name should have at least {#limit} characters',
            'string.max': 'Name should not exceed {#limit} characters'
        }),
    price: Joi.number()
        .required()
        .messages({
            'number.base': 'Price must be a number',
            'any.required': 'Price is required'
        }),
    priceDiscount: Joi.number()
        .default(0)
        .messages({
            'number.base': 'Price discount must be a number',
            'any.required': 'Price discount is required'
        }),
    description: Joi.string()
        .required()
        .min(10)
        .max(350)
        .trim()
        .messages({
            'string.empty': 'Description is required',
            'string.min': 'Description should have at least {#limit} characters',
            'string.max': 'Description should not exceed {#limit} characters'
        }),
    summary: Joi.string()
        .required()
        .min(10)
        .max(100)
        .trim()
        .messages({
            'string.empty': 'Summary is required',
            'string.min': 'Summary should have at least {#limit} characters',
            'string.max': 'Summary should not exceed {#limit} characters'
        }),
    duration: Joi.number()
        .required()
        .messages({
            'number.base': 'Duration must be a number',
            'any.required': 'Duration is required'
        }),
    maxGroupSize: Joi.number()
        .required()
        .messages({
            'number.base': 'Max group size must be a number',
            'any.required': 'Max group size is required'
        }),
    difficulty: Joi.string()
        .valid('easy', 'medium', 'difficult')
        .required()
        .messages({
            'any.only': 'Difficulty must be one of easy, medium, or difficult',
            'string.empty': 'Difficulty is required'
        }),
    ratingsAverage: Joi.number().default(0),
    ratingsQuantity: Joi.number().default(0),
    imageCover: Joi.string()
        .required()
        .messages({
            'string.empty': 'Image cover is required'
        }),
    images: Joi.array()
        .items(Joi.string())
        .required()
        .messages({
            'array.base': 'Images must be an array',
            'any.required': 'Images are required'
        }),
    guides: Joi.array()
        .items(Joi.string())
        .required()
        .messages({
            'array.base': 'Guides must be an array',
            'any.required': 'Guides are required'
        }),
    startDates: Joi.array()
        .items(Joi.date())
        .required()
        .messages({
            'array.base': 'Start dates must be an array of dates',
            'any.required': 'Start dates are required'
        }),
    secretTour: Joi.boolean().default(false),
    startLocation: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required(),
        address: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    locations: Joi.array().items(
        Joi.object({
            type: Joi.string().valid('Point').required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
            address: Joi.string().required(),
            description: Joi.string().required(),
            day: Joi.number().required()
        })
    ).required()
});

const updateTourSchema = Joi.object({
    name: Joi.string().min(2).max(30).trim(),
    price: Joi.number(),
    priceDiscount: Joi.number(),
    description: Joi.string().min(10).max(350).trim(),
    summary: Joi.string().min(10).max(100).trim(),
    duration: Joi.number(),
    maxGroupSize: Joi.number(),
    difficulty: Joi.string().valid('easy', 'medium', 'difficult'),
    ratingsAverage: Joi.number(),
    ratingsQuantity: Joi.number(),
    imageCover: Joi.string(),
    images: Joi.array().items(Joi.string()),
    guides: Joi.array().items(Joi.string()),
    startDates: Joi.array().items(Joi.date()),
    secretTour: Joi.boolean(),
    startLocation: Joi.object({
        type: Joi.string().valid('Point'),
        coordinates: Joi.array().items(Joi.number()).length(2),
        address: Joi.string(),
        description: Joi.string()
    }),
    locations: Joi.array().items(
        Joi.object({
            type: Joi.string().valid('Point'),
            coordinates: Joi.array().items(Joi.number()).length(2),
            address: Joi.string(),
            description: Joi.string(),
            day: Joi.number()
        })
    )
}).min(1);



module.exports = { createTourSchema, updateTourSchema };