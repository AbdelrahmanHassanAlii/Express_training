// loading dotenv
const dotenv = require('dotenv');
// setting up the environment variables before exporting app and starting the server
dotenv.config({
    path: './config.env'
});

const app = require('./index');

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} 🚀`);
});