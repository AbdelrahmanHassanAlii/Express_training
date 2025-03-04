const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const userRouter = require("./routes/users");
const productRouter = require("./routes/products");

const app = express();
// creating the Routes from the app 
// const productRouter = express.Router();
// const userRouter = express.Router();

const products = JSON.parse(fs.readFileSync(`${__dirname}/data/products.json`, "utf-8"));

// Middleware to parse JSON body
app.use(express.json());

// Middleware to log the request
// app.use((req, res, next) => {
//     console.log("Hello from the middleware 🤙!");
//     next();
// })

// Middleware to measure the time it takes to execute the request
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// middleware to log the request
app.use(morgan("dev"))

// creating the middleware for the Routes
app.use('/api/v1/products', productRouter)
app.use('/api/v1/users', userRouter)


// start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} 🚀`);
});
