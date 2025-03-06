const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        // Include stack trace only in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;