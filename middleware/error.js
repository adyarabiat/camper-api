const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    console.log(err);

    // Mongoose bad ObjectID
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose dublicate key => when we create an existing bootcamp
    if (err.code === 11000) {
        const message = 'Dublicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error => when create without required field/s
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new ErrorResponse(message, 400);
    }

    console.log(err.name);
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
};

module.exports = errorHandler;
