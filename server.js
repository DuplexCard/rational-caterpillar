const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Import routes
const phoneNumberRoutes = require('./routes');

// Middlewares
app.use(bodyParser.json());

// Routes
app.use(phoneNumberRoutes);

// Starting the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
