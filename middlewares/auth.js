const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const auth = (req, res, next) => {
  // Get the token from headers (Authorization: Bearer <token>)
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token using the secret stored in .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user data (userId) to the request object for use in route handlers
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
