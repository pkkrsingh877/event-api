/**
 * Centralized error handler middleware.
 * Catches errors from controllers and sends a formatted JSON response.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message || 'An unexpected error occurred.',
    // Include stack trace in development for easier debugging
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
