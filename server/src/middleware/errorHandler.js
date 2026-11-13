function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
      details: err.details || []
    }
  });
}

module.exports = errorHandler;
