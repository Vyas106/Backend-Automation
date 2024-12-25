const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../Models/UserSchema');
require('dotenv').config(); // Load environment variables

const router = express.Router();

// POST /signin route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token expiration time
        });

        // Send response
        res.json({ token });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
