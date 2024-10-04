const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS options to allow requests from frontend running on port 5500
const corsOptions = {
    credentials: true,
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'], // Allow requests from these origins
    methods: 'GET, POST, PUT, DELETE, OPTIONS', // Allow all methods for testing
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
};

// Use CORS middleware with specified options
app.use(cors(corsOptions));

// Use bodyParser middleware to parse JSON data
app.use(bodyParser.json());

// Import and use routes from 'routes.js'
const eventRoutes = require('./routes');
app.use('/api/events', eventRoutes); 

// Serve static files (if any, e.g., frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
