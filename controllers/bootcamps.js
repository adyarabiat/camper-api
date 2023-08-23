const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async'); // we use it to not repeate try catch everywhere
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // we change it to json string so we can apply replace on it so it will be as a string
    let queryStr = JSON.stringify(reqQuery);

    // So here we are looking for any of the options gt, gte, lt, lte, in and we replace them by adding $ infront of it
    // So the gt/gte/lt/lte are mongoose methods to find greater than or less than ....
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    // then we return it back to JS obj
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    // Select
    if (req.query.select) {
        // to make it compatible as mongoose select way
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // Sort
    if (req.query.sort) {
        // to make it compatible as mongoose select way
        const sortedBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortedBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const bootcamps = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
});

// @desc     Get single bootcamps
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    // this incase of correct formatted id and it not right number, it will not throw an error so we handle it here otherwise if the id is not formated right it will throw an error from the catch
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});

// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps
// @access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp,
    });
});

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.par - ams.id, req.body, {
        new: true, // when we get the data to be the updated one
        runValidators: true,
    });

    // this incase of correct formatted id and it not right number, it will not throw an error so we handle it here otherwise if the id is not formated right it will throw an error from the catch
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    // this incase of correct formatted id and it not right number, it will not throw an error so we handle it here otherwise if the id is not formated right it will throw an error from the catch
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    bootcamp.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});

// @desc     Get bootcamps within a radius
// @route    GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access   Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calculate radius using radians by:
    // Divide distance by radius of Earth
    // Earth Radius = 3963 miles / 6378 km
    const radius = distance / 6378; //I used Km here
    const bootcamps = await Bootcamp.find({
        // search for Center Sphere in mongoDB docs for more info
        location: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] },
        },
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
});
