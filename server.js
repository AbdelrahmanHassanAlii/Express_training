const app = require('./index');

// start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} 🚀`);
});