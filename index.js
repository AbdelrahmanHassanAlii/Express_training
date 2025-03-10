/* eslint-disable prettier/prettier */
const express = require("express");
const morgan = require("morgan");

const userRouter = require("./routes/users");
const productRouter = require("./routes/products");
const DBConnection = require("./DBConnection");

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Middleware to serve the static files
app.use(express.static(`${__dirname}/public`));

// Middleware to measure the time it takes to execute the request
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// middleware to log the request
if (process.env.NODE_ENV === 'development') app.use(morgan("dev"))

// connect to MongoDB
DBConnection();

// creating the middleware for the Routes
app.use('/api/v1/products', productRouter)
app.use('/api/v1/users', userRouter)


module.exports = app;