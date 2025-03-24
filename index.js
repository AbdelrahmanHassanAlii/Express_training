/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
const express = require("express");
const morgan = require("morgan");

const userRouter = require("./routes/usersRoutes");
const productRouter = require("./routes/productsRoutes");
const tourRouter = require("./routes/touresRouets");
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

// middleware to log the request if we in development mode 
if (process.env.NODE_ENV === 'development') app.use(morgan("dev"))

// connect to MongoDB
DBConnection();

// creating the middleware for the Routes
app.use('/api/v1/products', productRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tours', tourRouter)

// handle unknown routes
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    })
    next();
});

module.exports = app;