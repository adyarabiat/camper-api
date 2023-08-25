const advancedResults = (model, populate) => async (req, res, next) => {
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
    query = model.find(JSON.parse(queryStr));

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
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }
    const results = await query;

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

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results,
    };
    next();
};

module.exports = advancedResults;
