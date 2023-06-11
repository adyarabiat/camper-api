const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
} = require('../controllers/bootcamps');

const router = express.Router();

// We have two ways to add them
// first way
// router.get('/', getBootcamps);
// router.get('/:id', getBootcamp);
// router.post('/', createBootcamp);
// router.put('/:id', updateBootcamp);
// router.delete('/:id', deleteBootcamp);

// second way
router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;
