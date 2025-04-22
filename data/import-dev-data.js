/* eslint-disable global-require */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const TourModel = require('../models/tourModel');
// setting up the environment variables before exporting app and starting the server
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

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

const importTours = async () => {
    try {
        connectDB();
        await TourModel.create(tours);
        console.log('Data imported successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

if (process.argv[2] === '--import') {
    importTours();
}

const deleteTours = async () => {
    try {
        connectDB();
        await TourModel.deleteMany();
        console.log('Data deleted successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error deleting data:', error);
        process.exit(1);
    }
};

if (process.argv[2] === '--delete') {
    deleteTours();
}


