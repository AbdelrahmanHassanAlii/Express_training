/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

// Replace `<db_password>` with the actual password from environment variables
const DB = process.env.NODE_ENV === 'development' ? 
    process.env.DB_LOCAL :
    process.env.DB.replace("<db_password>", process.env.DB_PASSWORD) 


// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(DB);
        console.log(`MongoDB Connected 🤙: ${conn.connection.host} (${process.env.NODE_ENV} mode)`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;

