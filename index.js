const express = require('express');
const connectDB = require('./config/db');
const router = require('./routes'); // Renamed to lowercase for consistency
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for flexibility
require("dotenv").config();
// Connect to the database
app.use(errorHandler);
connectDB();

// Middleware
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1', router); // Mount routes with a consistent base URL

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
