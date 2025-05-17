/* eslint-disable no-console */
/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
const express = require("express");
const morgan = require("morgan");
const rateLimit = require('express-rate-limit');
const path = require('path');

const userRouter = require("./routes/usersRoutes");
const productRouter = require("./routes/productsRoutes");
const tourRouter = require("./routes/touresRouets");
const reviewsRouter = require("./routes/reviewsRoutes");
const DBConnection = require("./DBConnection");
const AppError = require("./utils/appError");
const { errorHandler } = require("./controllers/errorController");
const helmet = require("helmet");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");

// handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION 💥');
    console.error(err.name, err.message);
    process.exit(1);
})

// handle unhandled exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION 💥');
    console.error(err.name, err.message);
    process.exit(1);
})

// global rate limiter variable
const globalLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later'
});

const app = express();

// set the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global middlewares

// Middleware to serve the static files
app.use(express.static(path.join(__dirname, 'public')));

// Security headers
app.use(helmet());
// Middleware to parse JSON body
app.use(express.json({ limit: '10kb' }));
// sanitize data from noSQL query injection
app.use(ExpressMongoSanitize());
// sanitize data from xss
app.use(xssClean());
// prevent http parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'price',
        'maxGroupSize',
        'difficulty',
        'ratingsAverage',
        'ratingsQuantity'
    ]
}));

// Middleware to measure the time it takes to execute the request
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// middleware to log the request if we in development mode 
if (process.env.NODE_ENV === 'development') app.use(morgan("dev"))

// apply the global rate limiter
app.use("/api", globalLimiter);

// connect to MongoDB
DBConnection();

// creating the middleware for the Routes
app.get('/', (req, res) => {
    res.status(200).render('base', {
        title: 'The Park Camunda',
        message: 'Welcome to the Park Camunda website'
    });
})
app.use('/api/v1/products', productRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/reviews', reviewsRouter)

// handle unknown routes
app.all('*', (req, res, next) => {
    // using the res 
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // })

    // using the custom error middleware
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.statusCode = 404;
    // err.status = 'fail';
    // next(err);

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;