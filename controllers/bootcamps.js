const Bootcamp = require('../models/Bootcamps');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (err) {
        res.status(400).json({
            success: false,
        });
    }
};

// @desc     Get single bootcamps
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        // this incase of correct formatted id and it not right number, it will not throw an error so we handle it here otherwise if the id is not formated right it will throw an error from the catch
        if (!bootcamp) {
            return res.status(400).json({
                success: false,
            });
        }
        res.status(200).json({
            success: true,
            data: bootcamp,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
        });
    }
};

// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps
// @access   Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
        });
    }
};

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // when we get the data to be the updated one
            runValidators: true,
        });

        // this incase of correct formatted id and it not right number, it will not throw an error so we handle it here otherwise if the id is not formated right it will throw an error from the catch
        if (!bootcamp) {
            return res.status(400).json({
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            data: bootcamp,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
        });
    }
};

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        // this incase of correct formatted id and it not right number, it will not throw an error so we handle it here otherwise if the id is not formated right it will throw an error from the catch
        if (!bootcamp) {
            return res.status(400).json({
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        res.status(400).json({
            success: false,
        });
    }
};
