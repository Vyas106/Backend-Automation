const express = require('express');

const UserRouteForSignup = require('./Routes/SignupRoutes');
const UserRouteForSignin = require('./Routes/SigninRoutes');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use("/user", UserRouteForSignup); 
app.use("/user", UserRouteForSignin);   

// Export the app instance
module.exports = app;
