const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema'); // Adjust path as needed
const auth = require('../middlewares/auth');

// Utility function to handle errors
const handleError = (res, error, message = 'An error occurred. Please try again.', statusCode = 500) => {
    console.error(message, error);
    res.status(statusCode).json({ message });
};

// POST: User Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        // Basic Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Create a new user
        const user = new User({
            name: name?.trim() || null,
            email: email.trim(),
            phone: phone?.trim() || null,
            password: password.trim(),
            role: role || 'user', // Default role
        });

        // Save user to database
        const savedUser = await user.save();

        // Respond with success
        res.status(201).json({
            message: 'User registered successfully.',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
        });
    } catch (error) {
        handleError(res, error, 'Error registering user.');
    }
});





// GET: Fetch all users
router.get('/AllUsers',auth, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords from the response
        res.status(200).json(users);
    } catch (error) {
        handleError(res, error, 'Error fetching users.');
    }
});






// GET: Fetch user by ID
router.get('/users/:id',auth, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        handleError(res, error, 'Error fetching user.');
    }
});

module.exports = router;
