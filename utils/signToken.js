// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");

const generateSignToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

module.exports = generateSignToken;
