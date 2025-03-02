const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.message, { stack: err.stack });
    //Customizing response
    res.status(err.status || 500).json({ 
        error: {
            message: err.message || 'Internal Server Error',
        },
    });
};

module.exports = errorHandler;