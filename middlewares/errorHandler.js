const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
  
    // Check if the error is a MongoDB validation error or some other known error type
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: err.errors, // Provide detailed validation errors if needed
      });
    }
  
    // Handle MongoDB connection errors
    if (err.name === 'MongoNetworkError') {
      return res.status(500).json({ message: 'Database connection error' });
    }
  
    // Handle invalid JWT token errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  
    // Handle unauthorized access errors
    if (err.status === 401) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
  
    // Handle not found errors (for missing routes)
    if (err.status === 404) {
      return res.status(404).json({ message: 'Resource not found' });
    }
  
    // Default to generic server error if the error is unknown
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
    });
  };
  
  module.exports = errorHandler;
  