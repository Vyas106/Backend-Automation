const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema Definition
const UserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
        unique: true
    },
    name: {
        type: String,
        trim: true,
        match: /^[a-zA-Z0-9]+$/,
        minlength: 3,
        maxlength: 20,
        default: null,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
        type: String,
        match: /^\+?[1-9]\d{1,14}$/,
        default: null,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
});

// Hash password before saving the user document
UserSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (err) {
        next(err);
    }
});

// Compare plaintext password with the hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw new Error('Error comparing passwords');
    }
};

// Compile and export the User model
module.exports = mongoose.model('User', UserSchema);
