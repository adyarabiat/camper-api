const express = require('express');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5001;
const morgan = require('morgan'); //to create custom middlewares
const connectDB = require('./config/db'); //to create custom middlewares
const colors = require('colors');
const errorHandler = require('./middleware/error');

// Load env
dotenv.config({
    path: './config/config.env',
});

// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// use the middleware: error
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);

    // Close server & exit process
    server.close(() => process.exit(1));
});
