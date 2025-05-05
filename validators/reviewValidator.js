
const joi = require("joi");

const createReviewSchema = joi.object({
    review: joi.string().required(),
    rate: joi.number().required()
})

const updateReviewSchema = joi.object({
    review: joi.string(),
    rate: joi.number()
}).min(1);

module.exports = { createReviewSchema, updateReviewSchema }
